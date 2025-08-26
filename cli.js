import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
});

const prompt=ChatPromptTemplate.fromMessages([
    ['system','you are a helpful assistant'],
    ['human','{input}']
])

const chain=prompt.pipe(llm)

const input=process.argv.slice(2).join('') || "tell me a joke"
const res=await chain.invoke({input})
console.log(res.content)

const res2=await chain.invoke({input:'tell me a fun fact about space'})
console.log(res2.content)