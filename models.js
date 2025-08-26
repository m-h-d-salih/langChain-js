import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.3,
});

const res=await llm.invoke("say hii")
for await (const chunk of await llm.stream("stream a haiku")){
    process.stdout.write(chunk.content)
}

// llm.invoke(messagesOrText) → accepts a string or chat messages
console.log(res.content)
// llm.stream(...) → token/segment streaming