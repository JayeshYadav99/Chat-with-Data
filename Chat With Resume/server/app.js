const express = require('express');
const {getChunkedDocsFromPDF} = require('./PdfLoader');
const cors = require('cors');
const { OpenAIEmbeddings } = require("@langchain/openai");
const { BufferMemory } = require("langchain/memory");
const { ConversationalRetrievalQAChain,RetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("@langchain/openai");
const formatConvHistory = require('./formatConvHistory.js');

const {
  RunnablePassthrough,
  RunnableSequence,
} = require("@langchain/core/runnables");
const { formatDocumentsAsString } = require("langchain/util/document");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const { SupabaseVectorStore } = require('langchain/vectorstores/supabase');


// const fs = require('fs');
// const path = require('path');
const formidable = require('express-formidable');
const sbApiKey = process.env.SUPABASE_API_KEY
const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
const openAIApiKey = process.env.OPENAI_API_KEY
const app = express();
const port = 5000;


app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing
var Chat_history=[]
async function ensureVectorStore(client, documents, openAIApiKey,alreadyProcessed) {
  // Placeholder for checking if documents already processed
  // This should be replaced with actual logic to check for existing embeddings
  // This should be dynamic based on your application's logic

  let vectorStore;

  if (alreadyProcessed) {
    // Initialize vectorStore with existing data
    vectorStore = await  SupabaseVectorStore.fromExistingIndex( new OpenAIEmbeddings({ openAIApiKey }),{
     
      client,
      tableName: 'pdfdocuments', // Assuming this table contains your pre-processed embeddings
      queryName: 'match_pdfdocuments',
    });
  } else {
    // Process and store documents as embeddings
    vectorStore = await SupabaseVectorStore.fromDocuments(
      documents,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'pdfdocuments',
        queryName: 'match_pdfdocuments'
      }
    );

    // Optionally, here you might want to mark these documents as processed in your logic
    // to avoid reprocessing in the future
  }

  return vectorStore;
}

async function get_Conversation_chain(vectorStore,query) {
 
    const model=new ChatOpenAI({ openAIApiKey });
    // const memory = new BufferMemory({ memoryKey: "chat_history", returnMessages: true });

    // const conversation = new RetrievalQAChain({
    //     llm,
    //     retriever: vectorStore.asRetriever(),
    //     memory
  
    // });
    // const res = await conversation.invoke({
    //     query: "Who is Jayesh Yadav?",
    //   });
    //   console.log({ res });
    const vectorStoreRetriever = vectorStore.asRetriever();

      const SYSTEM_TEMPLATE = `Use the following pieces of context  and the conversation history  to answer the question at the end .Try to find the answer in the context. If the answer is not given in the context, find the answer in the chat_history if possible.

If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{context}

`;
const messages = [
  SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
  HumanMessagePromptTemplate.fromTemplate("{question}"),
];
const prompt = ChatPromptTemplate.fromMessages(messages);
// let chain = ConversationalRetrievalQAChain.fromLLM(
//   model,
//   vectorStore.asRetriever(),

// );
const chain = RunnableSequence.from([
  {
    context: vectorStoreRetriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);


const answer = await chain.invoke(
  query

);
// const answerText = await chain.invoke({ question: query, chat_history: formatConvHistory( Chat_history) });


// const {text}=answerText;
// Chat_history.push(query)
// Chat_history.push(text)
// console.log({text ,Chat_history});


//     return text;
// Chat_history.push(query)
// Chat_history.push(answer)
return answer;
}


app.post('/upload',formidable({
    multiples: true,
  }),async (req, res) => {
    console.log(req.files);
const {PDFdocs}=req.files;

    // You can now access the uploaded files using the files object
    console.log('Uploaded files:', PDFdocs);
    console.log('Path:', PDFdocs.path); 
    const output= await getChunkedDocsFromPDF(PDFdocs.path);
    const client = createClient(sbUrl, sbApiKey)
console.log("output",output); 





const vectorStore = await ensureVectorStore(client, output, openAIApiKey,false);

//     const conversation=await   get_Conversation_chain(vectorStore);
//     console.log("Answer",conversation);
    // const response = await conversation.invoke({ 'question': "Who is Jayesh Yadav" });
    // console.log("response", response);



    const conversation=await   get_Conversation_chain(vectorStore,`Given a professional resume, generate a list of insightful and relevant questions a recruiter might ask the candidate during an interview. The questions should aim to explore the candidate's experiences, skills, achievements, and qualifications as presented on their resume. Consider the following categories:
Among all these categories,give total 4 questions
    Work Experience: Questions that delve into the candidate's responsibilities, achievements, and learnings in their previous roles.
    Educational Background: Questions regarding the candidate's academic qualifications, special projects, and how their education has prepared them for their career.
    Skills and Competencies: Inquiries about specific skills listed on the resume, including how the candidate has applied these skills in a professional setting.
    Certifications and Courses: Questions about any additional certifications or courses completed by the candidate that are relevant to the job role.
    Personal Projects and Interests: Exploratory questions about any personal projects, volunteer work, or interests listed on the resume that demonstrate the candidate's passion and commitment to their field.
    Please craft concise and short questions that encourage the candidate to share examples and experiences from their professional journey ,dont give category of question just give questions.Give answer with md formatting`);
       
    console.log("Answer",conversation);
    
    

    // Optionally, move the file to a specific directory or perform other actions

    res.json({ message: 'Files uploaded successfully',question:conversation});
  });

  app.post('/getAnswer',async (req, res) => {
    console.log(req.body);
    const{query}=req.body;
    console.log("query",query);
    const client = createClient(sbUrl, sbApiKey)
    const vectorStore = await ensureVectorStore(client, [], openAIApiKey,true);
    const conversation=await   get_Conversation_chain(vectorStore,query);
    console.log("Answer",conversation);
    res.json({ message: 'Answer Found Successfully',answer:conversation});
  });

  // If you want to handle file name or path, you can listen to the 'fileBegin' event
  
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
