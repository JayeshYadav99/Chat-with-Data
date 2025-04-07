import { PromptTemplate } from "@langchain/core/prompts";
const CONDENSE_QUESTION_TEMPLATE = `
Rephrase the follow-up question as a standalone question in English.

- Ensure the question retains its original intent.
- If no chat_history is provided, assume minimal context and still generate a meaningful standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow Up question: {question}
Standalone question:`;
export const condenseQuestionPrompt = PromptTemplate.fromTemplate(
  CONDENSE_QUESTION_TEMPLATE
);

//
const ANSWER_TEMPLATE = `

Provide a detailed and comprehensive answer to the question . Ensure that your response highlights important keywords and phrases by **bolding** them. The answer should be based on the context and chat history provided.

<context>
  {context}
</context>

<chat_history>
  {chat_history}
</chat_history>

Question: {question}

Detailed Response:

`;

export const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);
