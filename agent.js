import 'dotenv/config';
import {z} from 'zod';
// 1) Model (Gemini)
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// 2) Agent plumbing
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";

// 3) Tools
import { DynamicStructuredTool } from "@langchain/core/tools";

// --- calculator tool (safe ops) ---
const CalcInput = z.object({
  a: z.number(),
  b: z.number(),
  op: z.enum(["add", "sub", "mul", "div", "pow"]),
});

const calculator=new DynamicStructuredTool({
    name:'calculator',
    description:
      "Accurate arithmetic. Use for numeric questions; supports add, sub, mul, div, pow.",
      schema:CalcInput,
      func:async({a,b,op})=>{
        const ops = {
      add: () => a + b,
      sub: () => a - b,
      mul: () => a * b,
      div: () => (b === 0 ? "Error: divide by zero" : a / b),
      pow: () => Math.pow(a, b),
    };
    return String(ops[op]());
      }
})


// 4) System prompt with agent_scratchpad (required for tool-using agents)
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful expert. 
- Decide if you need a tool. 
- If math is involved, prefer the calculator. 
- If fresh facts are needed, use web_search. 
- Otherwise answer directly, concisely.`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  // The agent runtime writes intermediate tool calls here:
  new MessagesPlaceholder("agent_scratchpad"),
]);

// 5) Model
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.2,
});
const tools = [calculator];
const agent = await createToolCallingAgent({ llm, tools, prompt });
const  executor=new AgentExecutor({
    agent,
    tools,
    verbose: true,                 // logs the ReAct loop
  returnIntermediateSteps: true, // include tool call history in output
})

// 7) Run two different queries (kid vs PhD)
const inputs = [
  { input: "Explain GPUs to a 10-year-old.", chat_history: [] }, // <— FIX
  { input: "Explain GPUs to a PhD.",         chat_history: [] }, // <— FIX
];


const results = await executor.batch(inputs, { concurrency: 2 });

for (const r of results) {
  console.log("\n--- FINAL ---\n", r.output);
  // If you set returnIntermediateSteps: true, you can also inspect:
  // console.dir(r.intermediateSteps, { depth: 5 });
}