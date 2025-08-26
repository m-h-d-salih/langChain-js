import dotenv from 'dotenv'
import { z } from "zod";
dotenv.config({path:'../.env'});

// --- MODEL (chat) ---
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// --- PROMPT + AGENT EXECUTOR ---
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";

// --- TOOLS ---
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRetrieverTool } from "langchain/tools/retriever";

import { MemoryVectorStore } from "langchain/vectorstores/memory";          // in-memory demo store
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";  // chunking


// ---------------------
// A) build a tiny GPU "knowledge base"
// ---------------------
const rawNotes = `
GPUs (graphics processing units) excel at parallel computation.
They run many small threads together, great for linear algebra (matmul), graphics, and ML.
CUDA (NVIDIA) and ROCm (AMD) expose kernels, blocks, and warps/wavefronts for SIMT execution.
GPUs have high memory bandwidth; latency is hidden by massive concurrency.
For PhD-level: key topics include SIMT vs SIMD, memory hierarchy (global/shared/register), occupancy,
coalesced memory access, tensor cores, and roofline performance modeling.
For kids: think of thousands of tiny helpers doing small jobs at the same time.
`;


// split into chunks (keeps context tidy)
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 60 });
const docs=await splitter.createDocuments([rawNotes]) //return Document[]

// embed + index in memory (demo)
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
});
const vectorstore=await MemoryVectorStore.fromDocuments(docs,embeddings) // build the index
const  retriever=vectorstore.asRetriever({k:3})  // top-3 matches
// turn retriever into a tool the agent can call
const kbTool=createRetrieverTool(retriever,{
    name:'gpu_kb',
    description:
    "Look up accurate facts about GPUs, CUDA/ROCm, parallelism, memory hierarchy, and kid-friendly explanations.",
}); // Tool with { query: string } input. :contentReference[oaicite:4]{index=4}

// ---------------------
// B) a tiny calculator tool (so agent can choose between tools)
// ---------------------
const CalcInput = z.object({ a: z.number(), b: z.number(), op: z.enum(["add", "sub", "mul", "div", "pow"]) });
const calculator = new DynamicStructuredTool({
  name: "calculator",
  description: "Do math exactly (add, sub, mul, div, pow).",
  schema: CalcInput,
  func: async ({ a, b, op }) => {
    const f = { add: a + b, sub: a - b, mul: a * b, div: b === 0 ? "Error: divide by zero" : a / b, pow: a ** b };
    return String(f[op]);
  },
});

// ---------------------
// C) prompt for a tool-using agent
// ---------------------
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful expert.
- If the question is about GPUs or needs specific facts, USE the "gpu_kb" tool.
- If the user asks for math, USE the "calculator" tool.
- Otherwise, answer directly and be concise.
When you use tools, incorporate the results into your final answer.`,
  ],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"), // required placeholder for tool calls
]);

// ---------------------
// D) wire the agent + run
// ---------------------

const llm = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash", temperature: 0.2 });
const tools = [kbTool, calculator];
const agent = await createToolCallingAgent({ llm, tools, prompt }); // provider-agnostic tool-calling agent :contentReference[oaicite:5]{index=5}
const executor = new AgentExecutor({ agent, tools, verbose: true });
const inputs = [
  { input: "Explain GPUs to a 10-year-old." },
  { input: "Explain GPUs to a PhD." },
  { input: "add 1 and 2" },
];
const results = await executor.batch(inputs, { concurrency: 2 });
for (const r of results) {
  console.log("\n--- ANSWER ---\n" + r.output);
}

// how it works (plain english)

// Split your notes → small chunks (helps retrieval). 
// Langchain

// Embed each chunk with Gemini embeddings → vectors. 
// Langchain

// Store vectors in MemoryVectorStore and expose asRetriever({ k }). 
// Langchain

// Wrap it with createRetrieverTool(retriever, {...}) so the agent can call it like a function. 
// api.js.langchain.com

// The agent (LLM) decides when to call gpu_kb (for facts) or calculator (for math), then returns a final answer.