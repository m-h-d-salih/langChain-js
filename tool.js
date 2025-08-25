import { tool } from "@langchain/core/tools";
import { z } from "zod";

const multiply=tool(({a,b})=>{
    return a*b;
},
{
    name:'multiply',
    description:'Multiply two numbers',
    schema:z.object({

        a:z.number(),
        b:z.number()
    })
}
)
const res=await multiply.invoke({a:2,b:3})
// console.log(res)
// console.log(multiply.name,multiply.description)


