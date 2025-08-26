import 'dotenv/config'
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are concise."],
  ["human", "{question}"],
]);
// This is a prompt template.

// If you call it with variables, e.g. { question: "Who is Ronaldo?" }, it produces chat messages like:
// [
//   { role: "system", content: "You are concise." },
//   { role: "human", content: "Who is Ronaldo?" }
// ]

const model = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash" });
const parser=new StringOutputParser();

const chain=prompt.pipe(model).pipe(parser);
// prompt.pipe(model)

// Here, .pipe() connects the output of the prompt to the input of the model.

// So whenever you invoke the chain, LangChain does:

// Take your { question: "..." }.

// Use prompt to format it into chat messages.

// Pass those chat messages directly into model.
// {
//   id: "...",
//   role: "assistant",
//   content: "Cristiano Ronaldo is a Portuguese footballer..."
// }
// 3. .pipe(parser)

// Now, you attach the StringOutputParser.

// Its job is to take the LLM response object and strip it down to just the string content.

// So instead of dealing with structured objects, you just get:
// "Cristiano Ronaldo is a Portuguese footballer..."

const text=await chain.invoke({question:'who is ronaldo'})
const many=await chain.batch([
     { question: "Explain GPUs to a 10-year-old." },
  { question: "Explain GPUs to a PhD." },
])
console.log(text)
console.log(many)
const stream=await chain.stream({question:'stream a 1 verse poem'})
for await (const token of stream) process.stdout.write(token)