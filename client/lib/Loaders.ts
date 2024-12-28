import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
export const getSupabaseClient = () => {
  const client = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PRIVATE_KEY ?? ""
  );
  return client;
};
const chunkDocs = async (docs: any) => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 70,
  });
  const chunkedDocs = await textSplitter.splitDocuments(docs);
  return chunkedDocs;

};
export const LoadWebDocs = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    // required params = ...
    // optional params = ...
  });

  const docs = await loader.load();
  const chunkedDocs = await chunkDocs(docs);
  const client = getSupabaseClient();
  const vectorStore = await getVectorStore(chunkedDocs, client);
    console.log("Vector Store:", vectorStore);
  return url;

};
async function getVectorStore(fileContent: any, client: any) {
  try {
    const vectorStore = await SupabaseVectorStore.fromDocuments(
      fileContent,
      new GoogleGenerativeAIEmbeddings({
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      {
        client,
        tableName: "documents",
        queryName: "match_documents",
      }
    );
    return vectorStore;
  } catch (error) {
    console.error("Failed to create Supabase vector store:", error);
    throw new Error("Failed to create Supabase vector store");
  }
}