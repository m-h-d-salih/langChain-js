import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt=ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
  ["human", "Summarize this in 1 line: {text}"],
])
// fromMessages([[role, template], ...])

// .formatMessages(vars) → returns array of messages

// (advanced) .partial(partials) → “lock in” some variables for reuse later

const msgs=await chatPrompt.formatMessages({text:'langchain helps build llm apps'})
console.log(msgs)

// fromMessages = create a reusable template with placeholders.

// formatMessages = fill in the placeholders with real data and produce the final messages ready for the LLM.