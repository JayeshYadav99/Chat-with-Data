import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const cleanText = (text: string) => {
  // Replace � or any non-printable characters and remove invalid Unicode sequences
  return text
    .replace(/[^\x20-\x7E]/g, '')  // Removes non-ASCII characters
    .replace(/\\u[0-9a-fA-F]{4}/g, '');  // Removes Unicode escape sequences like \uXXXX
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

export default getChunkedDocsFromPDF;
