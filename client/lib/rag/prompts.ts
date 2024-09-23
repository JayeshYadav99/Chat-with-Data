import { PromptTemplate } from "@langchain/core/prompts";
const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language(English).

<chat_history>
  {chat_history}
</chat_history>

Follow Up Input: {question}
Standalone question:`;
 export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE,
);