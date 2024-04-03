const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// import { env } from "./config";

 async function getChunkedDocsFromPDF(PATH) {
  try {
    const loader = new PDFLoader(PATH);
    const docs = await loader.load();

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 70,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
console.log("chunkedDocs",chunkedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
module.exports = { getChunkedDocsFromPDF };