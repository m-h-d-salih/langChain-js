import { StringOutputParser } from "@langchain/core/output_parsers";


const asString=new StringOutputParser();
await asString.invoke({/* prior runnable output */ })// returns a string