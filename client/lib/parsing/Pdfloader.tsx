import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// import { env } from "./config";



 async function getChunkedDocsFromPDF(PATH:any) {

  try {
    console.log("PATH",PATH)
    const loader = new PDFLoader(PATH);
    const docs = await loader.load();
    console.log("docs",docs)

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 70,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
// console.log("chunkedDocs",chunkedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("PDF docs chunking failed !");
  }
}
export default getChunkedDocsFromPDF;