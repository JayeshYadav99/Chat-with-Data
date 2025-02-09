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
import { EPubLoader } from "@langchain/community/document_loaders/fs/epub";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
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
    const loader = new MultiFileLoader([PATH], {
      ".json": (path) => new JSONLoader(path, "/texts"),
      ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
      ".txt": (path) => new TextLoader(path),

      ".csv": (path) =>
        new CSVLoader(path, {
          separator: ",",
        }),
      ".pdf": (path) => new PDFLoader(path),
      ".docx": (path) => new DocxLoader(path),
      ".epub": (path) => new EPubLoader(path),
      ".pptx": (path) => new PPTXLoader(path),
    });
    // const loader = new UnstructuredLoader(
    // PATH
    // );
    const rawDocs = await loader.load();
    // // Include the source in the metadata of each document
    // const enrichedDocs = rawDocs.map((doc) => ({
    //   ...doc,
    //   metadata: {
    //     ...doc.metadata,
    //     source: PATH, // Add the file path to the metadata
    //   },
    // }));

    const cleanedDocs =
      extension === ".pdf"
        ? rawDocs.map((doc) => {
            doc.pageContent = cleanText(doc.pageContent);
            return doc;
          })
        : rawDocs;

    // const cleanedDocs =
    //   extension === ".pdf"
    //     ? rawDocs.map((doc) => {
    //       doc.pageContent = cleanText(doc.pageContent);
    //       return doc;
    //       })
    //     : rawDocs;
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

export async function getChunkedDocsFromUnstructured(PATH: string) {
  try {
    console.log("PATH", PATH);
    const extension = path.extname(PATH).toLowerCase(); // Get file extension in lowercase

    const loader = new UnstructuredLoader(PATH, {
      strategy: "hi_res",
      chunkingStrategy: "by_title",
    });
    const rawDocs = await loader.load();
    // Include the source in the metadata of each document
    const enrichedDocs = rawDocs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: PATH, // Add the file path to the metadata
      },
    }));

    const cleanedDocs =
      extension === ".pdf"
        ? enrichedDocs.map((doc) => {
            doc.pageContent = cleanText(doc.pageContent);
            return doc;
          })
        : enrichedDocs;

    // const cleanedDocs =
    //   extension === ".pdf"
    //     ? rawDocs.map((doc) => {
    //       doc.pageContent = cleanText(doc.pageContent);
    //       return doc;
    //       })
    //     : rawDocs;
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
