import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { env } from "./config";

 export const getChunkedDocsFromCSV=async (PATH)=> {
  try {
    const loader = new CSVLoader(PATH);
    const docs = await loader.load();

    // From the docs https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);
console.log("chunkedDocs",chunkedDocs);
    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error("CSV docs chunking failed !");
  }
}
