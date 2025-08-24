import dotenv from 'dotenv'
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

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
const systemTemplate = "Translate the following from English into {language}";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{text}"],
]);
const promptValue = await promptTemplate.invoke({
  language: "italian",
  text: "hi!",
});
promptValue.toChatMessages();
console.log(promptValue);
const sample=[
    new SystemMessage("greet him"),
    new HumanMessage("hello")
]
const response = await model.invoke(promptValue);
const response2 = await model.invoke(sample);
console.log(`${response.content}`);
console.log(`${response2.content}`);
