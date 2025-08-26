import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model=new  ChatGoogleGenerativeAI({model:'gemini-2.0-flash', temperature: 0.2 })

const stream=await model.stream(
    'write 1 verse song about goldfish on the moon'
)
for await (const chunk of  stream){
    process.stdout.write(chunk.content)
}