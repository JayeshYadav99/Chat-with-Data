import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import path from "path"; // Built-in Node.js module
const cleanText = (text: string) => {
  // Replace � or any non-printable characters and remove invalid Unicode sequences
  return text
    .replace(/[^\x20-\x7E]/g, "") // Removes non-ASCII characters
    .replace(/\\u[0-9a-fA-F]{4}/g, ""); // Removes Unicode escape sequences like \uXXXX
};

async function getChunkedDocsFromPDF(PATH: string) {
  try {
    console.log("PATH", PATH);

    const loader = new PDFLoader(PATH);
    const docs = await loader.load();

    // Clean the text of unsupported Unicode characters in each document
    const cleanedDocs = docs.map((doc) => {
      doc.pageContent = cleanText(doc.pageContent);
      return doc;
    });

    console.log("cleanedDocs", cleanedDocs);

    // Split the cleaned documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 70,
    });

    const chunkedDocs = await textSplitter.splitDocuments(cleanedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed!");
  }
}

export async function getChunkedDocsFromSource(PATH: string) {
  try {
    console.log("PATH", PATH);
    const extension = path.extname(PATH).toLowerCase(); // Get file extension in lowercase
    const loader = new MultiFileLoader(
      [
        // "src/document_loaders/example_data/example/example.txt",
        // "src/document_loaders/example_data/example/example.csv",
        // "src/document_loaders/example_data/example2/example.json",
        // "src/document_loaders/example_data/example2/example.jsonl",
        PATH,
      ],
      {
        ".json": (path) => new JSONLoader(path, "/texts"),
        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),

        ".csv": (path) => new CSVLoader(path,{
          separator:',',
   
        }),
        ".pdf": (path) => new PDFLoader(path),
        ".docx":(path) => new  DocxLoader(path),
        
        

      }
    );
    const rawDocs = await loader.load();
    const cleanedDocs =
      extension === ".pdf"
        ? rawDocs.map((doc) => {
          doc.pageContent = cleanText(doc.pageContent);
          return doc;
          })
        : rawDocs;
    // Split the cleaned documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 70,
    });

    const chunkedDocs = await textSplitter.splitDocuments(cleanedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed!");
  }
}
export default getChunkedDocsFromPDF;
