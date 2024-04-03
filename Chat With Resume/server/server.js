import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseHybridSearch } from "@langchain/community/retrievers/supabase";
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { getChunkedDocsFromCSV } from "./CsvLoader.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";

dotenv.config();
export const run = async () => {
    const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
const openAIApiKey = process.env.OPENAI_API_KEY
console.log("sbApiKey",sbApiKey);
const client = createClient(sbUrl, sbApiKey)
  
  const output= await getChunkedDocsFromCSV("job.csv");
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });
// const   vectorStore = await SupabaseVectorStore.fromDocuments(
//     output,
//     new OpenAIEmbeddings({ openAIApiKey }),
//     {
//       client,
//       tableName: 'documents',
//       queryName: 'match_documents'
//     }
//   );


//   const vectorStoreRetriever = new SupabaseHybridSearch(embeddings, {
//     client,
//     //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
//     similarityK: 2,
//     keywordK: 2,
//     tableName: "documents",
//     similarityQueryName: "match_documents",
//     keywordQueryName: "kw_match_documents",
//   });
  
  const vectorStoreRetriever = new SupabaseHybridSearch(embeddings, {
    client,
    //  Below are the defaults, expecting that you set up your supabase table and functions according to the guide above. Please change if necessary.
    similarityK: 2,
    keywordK: 2,
    tableName: "documents",
    similarityQueryName: "match_documents",
    keywordQueryName: "kw_match_documents",
  });
  const query = "I want android developer ";

//   const results = await retriever.getRelevantDocuments("I want react developer");

//   console.log("Resultes",results);
  const model=new ChatOpenAI({ openAIApiKey });
  const SYSTEM_TEMPLATE = `Use the following pieces of context  .Try to find the answer in the context. If the answer is not given in the context, find the answer in the chat_history if possible.

  If you don't know the answer, just say that you don't know, don't try to make up an answer.
  ----------------
  {context}
  
  `;
  
  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];
  const prompt = ChatPromptTemplate.fromMessages(messages);
  const chain = RunnableSequence.from([
    {
      context: vectorStoreRetriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);
  
  
  const answer = await chain.invoke(
    query
  
  );
  
    console.log("answer",answer);
};
run();