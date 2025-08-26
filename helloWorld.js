import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash', // fast + cheap; swap to 'gemini-1.5-pro' for stronger reasoning
  temperature: 0.3,
});

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a crisp, helpful assistant.'],
  ['human', '{input}'],
]);

const chain = prompt.pipe(llm);

const input =
  process.argv.slice(2).join(' ') ||
  'Give me 3 app ideas that combine LangChain + Gemini. Keep it short.';
const res = await chain.invoke({ input });

console.log('\n--- RESPONSE ---\n');
console.log(res.content);
