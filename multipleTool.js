import dotenv from 'dotenv'
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Tool } from 'langchain/tools';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

dotenv.config();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});

const calculator={
name:'calculator',
    description:'perform basic arithematic operation',
    func:async(input)=>{
        try {
            return eval(input).toString();
        } catch (error) {
            return "invalid error"
        }
    }
}
;(async()=>{
const executer=initializeAgentExecutorWithOptions(
    [calculator],
    model,{
        agentType:"zero-shot-react-description",
        verbose:true,
    }
)
const res=await executer.ivoke({
    input: "What is (12 + 8) / 5 ? Use the calculator tool. Reply with just the number.",
})
console.log(executer)
})();
