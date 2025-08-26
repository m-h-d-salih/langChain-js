import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const llm=new ChatGoogleGenerativeAI({
    model:'gemini-2.0-flash',   // fast Gemini model
  temperature: 0.3,       
})

const res=await llm.invoke("explain langchain in one sentence.");
console.log(res.content)