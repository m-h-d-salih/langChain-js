import { PromptTemplate } from "@langchain/core/prompts";

const p=PromptTemplate.fromTemplate(" trasnlate to french : {text}");
//create a template with {varibales}

await p.format({text:'good morning'})
//translate to fresh : Good morning
//.format(vars) => produce a string 
await p.invoke({text:'good morning'})
//same as format, but as a runnable output
//.invoke(vars)=>produce a string as runnable
