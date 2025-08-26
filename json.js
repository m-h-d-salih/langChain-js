import 'dotenv/config';
import { z } from 'zod';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const llm = new ChatGoogleGenerativeAI({ model: 'gemini-2.0-flash' });

const schema = z.object({
  title: z.string(),
  bullets: z.array(z.string()).length(3),
});

const jsonModel = llm.withStructuredOutput(schema);
const out = await jsonModel.invoke('Summarize LangChain+Gemini in a title and 3 bullets.');
console.log(out); // { title: "...", bullets: ["...","...","..."] }
