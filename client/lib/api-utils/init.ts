import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { createOpenAI } from "@ai-sdk/openai";

export const initSupabase = () => {
  return createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PRIVATE_KEY ?? ""
  );
};

export const initVectorStore = (supabase: ReturnType<typeof createClient>) => {
  return new SupabaseVectorStore(
    new GoogleGenerativeAIEmbeddings({
      model: "embedding-001",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document Embeddings",
    }),
    {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    }
  );
};

export const initGroq = () => {
  return createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });
};
