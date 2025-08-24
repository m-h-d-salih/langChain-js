import dotenv from 'dotenv'
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});
const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];
const res = await model.invoke(messages);
console.log(res.content);
 const LANGSMITH_TRACING="true";
 const  LANGSMITH_API_KEY=process.env.LANGSMITH_API_KEY;