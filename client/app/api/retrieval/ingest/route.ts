// https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/docs/modules/data_connection/document_transformers/text_splitters/recursive_text_splitter
 * https://js.langchain.com/docs/modules/data_connection/vectorstores/integrations/supabase
 */

  import getChunkedDocsFromPDF from "../../../../lib/parsing/Pdfloader"
  import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from "next/server";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { TaskType } from "@google/generative-ai";
import { writeFile } from "fs/promises";
import { downloadFromURL } from "../../../../lib/parsing/DownloadFromVercel";

import { put } from "@vercel/blob";
import path from "path";
export const runtime = "nodejs";
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: NextRequest) {
  try {
   
    const formData = await req.formData();
    const file = formData.get("PDFdocs") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const blob  = await put(file.name, file, { access: 'public' });
    console.log(blob);
    const localFilePath = await downloadFromURL(blob.url);
    // return NextResponse.json({ ok: true, url: blob.url }, { status: 200 });

    // const buffer = Buffer.from(await file.arrayBuffer());
    // const filename =  file.name.replaceAll(" ", "_");
    // const filePath = path.join(process.cwd(), "public/assets", filename);
    // console.log(filename,filePath);
    // try {
    //   await writeFile(
    //     filePath,
    //     buffer
    //   );
    //   // return NextResponse.json({ Message: "Success", status: 201 });
    // } catch (error) {
    //   console.log("Error occured ", error);
    //   return NextResponse.json({ Message: "Failed", status: 500 });
    // }


    const fileContent = await getChunkedDocsFromPDF( localFilePath)
    console.log("File Content:", fileContent);


    const text = "hello"; // Replace with actual text extraction logic if needed

    // const client = createClient(
    //   "https://trouoginfkvdnltttkec.supabase.co",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyb3VvZ2luZmt2ZG5sdHR0a2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNjU0NjAsImV4cCI6MjAyMzY0MTQ2MH0.MeVLmP2zfVb6tbyk_V5PqGdubuqGhPYqJx9Fz4PMQ-s"
    // );
   
    const client = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_PRIVATE_KEY ?? ""
    );

  

    try {
      const vectorStore = await SupabaseVectorStore.fromDocuments(
        fileContent ,
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
      // console.log(vectorStore);
    } catch (error) {
      console.error("Failed to create Supabase vector store:", error);
      throw new Error("Failed to create Supabase vector store");
    }
    revalidatePath('/chat');
    return NextResponse.json({ ok: true,filename:blob.pathname }, { status: 200 });
  } catch (e : any) {
    console.log(e,e.message)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

