import { downloadFromURL } from "./parsing/DownloadFromVercel";
import getChunkedDocsFromPDF from "./parsing/Pdfloader";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { MongoClient } from "mongodb";
import fs from "fs";

export const getSupabaseClient = () => {
  const client = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PRIVATE_KEY ?? "",
  );
  return client;
};

const client = new MongoClient(process.env.MONGODB_URL ?? "");
const collection = client.db("chatwithdocs").collection("document");
console.log("MongoDB collection selected");

// export async function loadDocsintoVectorDatabase(file_url: string)
// {
//     console.log("MongoDB VectorBase ------------------------------------>")
//     //  1. obtain the pdf -> downlaod and read from pdf
//     console.log("downloading Docs into file system");
//     const  localFilePath= await downloadFromURL(file_url);
//     console.log("file downloaded at ", localFilePath);

// try {
//     const fileContent = await getChunkedDocsFromPDF( localFilePath)
//     if(fileContent==null)
//       {
//         throw new Error("Error processing file content");
//       }
//     console.log("File Content:", fileContent);

//     const vectorStore = await getVectorStore(fileContent, client);
//     console.log("Vector Store:", vectorStore);
//     fs.unlink(localFilePath, (err) => {
//         if (err) {
//           console.error("Error deleting temporary file:", err);
//         } else {
//           console.log(`Temporary file ${localFilePath} deleted successfully.`);
//         }
//       });

//       return localFilePath;
// } catch (error) {

//     console.error("Error processing file:", error);
//     throw error;

// }

// }

export function vectorStore(): MongoDBAtlasVectorSearch {
  const vectorStore: MongoDBAtlasVectorSearch = new MongoDBAtlasVectorSearch(
    new GoogleGenerativeAIEmbeddings({
      model: "embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document Embeddings",
    }),
    searchArgs(),
  );
  return vectorStore;
}

interface MongoDBAtlasVectorSearchLibArgs {
  collection: any;
  indexName: string;
  textKey: string;
  embeddingKey: string;
}

export function searchArgs(): MongoDBAtlasVectorSearchLibArgs {
  const searchArgs: MongoDBAtlasVectorSearchLibArgs = {
    collection,
    indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
    textKey: "content", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  };

  return searchArgs;
}
async function getVectorStore(fileContent: any, client: any) {
  const collection = client.db("chatwithdocs").collection("document");
  try {
    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      fileContent,
      new GoogleGenerativeAIEmbeddings({
        model: "embedding-001",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      {
        collection,
        indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
        textKey: "content", // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
      },
      //   {
      //     client,
      //     tableName: "documents",
      //     queryName: "match_documents",
      //   }
    );
    return vectorStore;
  } catch (error) {
    console.error("Failed to create Supabase vector store:", error);
    throw new Error("Failed to create Supabase vector store");
  }
}
