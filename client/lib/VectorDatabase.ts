import { downloadFromURL } from "./parsing/DownloadFromVercel";
import getChunkedDocsFromPDF from "./parsing/Pdfloader";
import {
  getChunkedDocsFromSource,
  getChunkedDocsFromUnstructured,
} from "./parsing/Pdfloader";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import fs from "fs";

export const getSupabaseClient = () => {
  const client = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PRIVATE_KEY ?? "",
  );
  return client;
};
export async function loadDocsintoVectorDatabase(
  file_url: string,
  file_type: string,
) {
  console.log("Supabase VectorBase ------------------------------------>");
  //  1. obtain the pdf -> downlaod and read from pdf
  console.log("downloading Docs into file system");
  const localFilePath = await downloadFromURL(file_url, file_type);
  console.log("file downloaded at ", localFilePath, file_type);

  try {
    let fileContent;
    if (
      file_type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      fileContent = await getChunkedDocsFromUnstructured(localFilePath);
    } else {
      fileContent = await getChunkedDocsFromPDF(localFilePath);
    }

    // const fileContent = await getChunkedDocsFromUnstructured(localFilePath);
    if (fileContent == null) {
      throw new Error("Error processing file content");
    }
    console.log("File Content:", fileContent);
    const client = getSupabaseClient();
    const vectorStore = await getVectorStore(fileContent, client);
    console.log("Vector Store:", vectorStore);
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Error deleting temporary file:", err);
      } else {
        console.log(`Temporary file ${localFilePath} deleted successfully.`);
      }
    });

    return localFilePath;
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
}

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
      },
    );
    return vectorStore;
  } catch (error) {
    console.error("Failed to create Supabase vector store:", error);
    throw new Error("Failed to create Supabase vector store");
  }
}
