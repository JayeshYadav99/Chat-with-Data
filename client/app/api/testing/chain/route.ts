import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { formatDocumentsAsString } from "langchain/util/document";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {

  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
export async function POST(req: NextRequest)
{
    try
    {
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-pro",
            maxOutputTokens: 2048,
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
              },
            ],
          });
          const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

          Chat History:
          {chat_history}
          Follow Up Input: {question}
          Standalone question:`;
          const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
            condenseQuestionTemplate
          );
          const answerTemplate = `Answer the question based only on the following context:
          {context}
          
          Question: {question}
          `;
          const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);
          
          const formatChatHistory = (chatHistory: [string, string][]) => {
            const formattedDialogueTurns = chatHistory.map(
              (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
            );
            return formattedDialogueTurns.join("\n");
          };
          
          const client = createClient(
            process.env.SUPABASE_URL ?? "",
            process.env.SUPABASE_PRIVATE_KEY ?? ""
          );
        const vectorstore = new SupabaseVectorStore( new GoogleGenerativeAIEmbeddings({
            model: "embedding-001", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "Document Embeddings",
          }), {
          client,
          tableName: "documents",
          queryName: "match_documents",
        });

          const retriever = vectorstore.asRetriever();

type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

const standaloneQuestionChain = RunnableSequence.from([
  {
    question: (input: ConversationalRetrievalQAChainInput) => input.question,
    chat_history: (input: ConversationalRetrievalQAChainInput) =>
      formatChatHistory(input.chat_history),
  },
  CONDENSE_QUESTION_PROMPT,
  model,
  new StringOutputParser(),
]);

const answerChain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  ANSWER_PROMPT,
  model,
]);const conversationalRetrievalQAChain =
standaloneQuestionChain.pipe(answerChain);

const result1 = await conversationalRetrievalQAChain.invoke({
question: "Describe the candidate based on document?Answer in Simple English",
chat_history: [],
});
console.log(result1);
          
    
          return NextResponse.json({ success:true ,result1}, { status: 200 },);
        
    }
    catch(error)
    {
        console.log(error)
    }

}