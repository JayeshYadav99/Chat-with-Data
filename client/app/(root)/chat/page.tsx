"use client"
import React from 'react'
// import Chat from '../../../components/shared/Chat'
// import FileUpload from '../../../components/shared/FileUpload'
import{ useState,useEffect} from 'react'
// import ReactMarkdown from 'react-markdown'
// import PdfPreviewUpload from '@/components/shared/PDFViewer'
import axios from 'axios'
import PdfViewer from '@/components/shared/PDFViewer'
import DocumentUploadForm from '@/components/shared/DocumentUploadForm'
import ChatWindow from '@/components/shared/Chatwindow'
// import { set } from 'mongoose'
const page = () => {

    const InfoCard = (
        <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
          <h1 className="text-3xl md:text-4xl mb-4">
            ▲ Next.js + LangChain.js Retrieval Chain 🦜🔗
          </h1>
          <ul>
            <li className="hidden text-l md:block">
              🔗
              <span className="ml-2">
                This template showcases how to perform retrieval with a{" "}
                <a href="https://js.langchain.com/" target="_blank">
                  LangChain.js
                </a>{" "}
                chain and the Vercel{" "}
                <a href="https://sdk.vercel.ai/docs" target="_blank">
                  AI SDK
                </a>{" "}
                in a{" "}
                <a href="https://nextjs.org/" target="_blank">
                  Next.js
                </a>{" "}
                project.
              </span>
            </li>
            <li className="hidden text-l md:block">
              🪜
              <span className="ml-2">The chain works in two steps:</span>
              <ul>
                <li className="ml-4">
                  1️⃣
                  <span className="ml-2">
                    First, it rephrases the input question into a
                    &quot;standalone&quot; question, dereferencing pronouns based on
                    the chat history.
                  </span>
                </li>
                <li className="ml-4">
                  2️⃣
                  <span className="ml-2">
                    Then, it queries the retriever for documents similar to the
                    dereferenced question and composes an answer.
                  </span>
                </li>
              </ul>
            </li>
            <li className="hidden text-l md:block">
              💻
              <span className="ml-2">
                You can find the prompt and model logic for this use-case in{" "}
                <code>app/api/chat/retrieval/route.ts</code>.
              </span>
            </li>
            <li>
              🐶
              <span className="ml-2">
                By default, the agent is pretending to be a talking puppy, but you
                can change the prompt to whatever you want!
              </span>
            </li>
            <li className="text-l">
              🎨
              <span className="ml-2">
                The main frontend logic is found in{" "}
                <code>app/retrieval/page.tsx</code>.
              </span>
            </li>
            <li className="text-l">
              🐙
              <span className="ml-2">
                This template is open source - you can see the source code and
                deploy your own version{" "}
                <a
                  href="https://github.com/langchain-ai/langchain-nextjs-template"
                  target="_blank"
                >
                  from the GitHub repo
                </a>
                !
              </span>
            </li>
            <li className="hidden text-l md:block">
              🔱
              <span className="ml-2">
                Before running this example on your own, you&apos;ll first need to
                set up a Supabase vector store. See the README for more details.
              </span>
            </li>
            <li className="text-l">
              👇
              <span className="ml-2">
                Upload some text, then try asking e.g.{" "}
                <code>What is a document loader?</code> below!
              </span>
            </li>
          </ul>
        </div>
      );



  return (
    <div>
      {/* <FileUpload />
        <Chat/> */}

      <div className="flex h-screen bg-gray-100">
        <aside className="w-1/4 bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-blue-500 text-white">
              + New Chat
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M17 12h.01" />
              <path d="M12 12h.01" />
              <path d="M7 12h.01" />
            </svg>
          </div>
          <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Your Resume</h2>
      <DocumentUploadForm />
  
    </div>
          {/* <FileUpload/> */}
          <div className="flex items-center justify-between mb-6">
            {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-blue-500 text-white">
              Upgrade to Plus
            </button> */}
            {/* <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gray-200">
              New Folder
            </button> */}
          </div>
          <div className="space-y-2">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              Jayesh Yadav (3).pdf
            </div>
           
          </div>
          <div className="absolute bottom-0 left-0 p-6 w-1/4">
            <button className="inline-flex bg-red-200 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gray-200 w-full mb-2">
              Sign in to save your chat history
            </button>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Home</span>
              <span>Account</span>
              <span>API</span>
              <span>FAQ</span>
              <span>Feedback</span>
            </div>
          </div>
        </aside>
        <main className="w-3/4 flex">
          <div className="w-1/2 bg-red-500 p-6">
           

            <section className='mb-6  h-screen overflow-hidden'>
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black font-bold">PDF Preview</h1>
            </header>
          
           <PdfViewer  previewUrl={"https://xf6s4f8pcrct3qte.public.blob.vercel-storage.com/10th%20Maths%20-%202019%20March%20-%20Eng%20(VisionPapers.org)-uXhUX5kYBHhNimh0EAarlCfwP1sQcc.pdf"}/>

            </section>
          
          </div>
          <div className="w-1/2 bg-white p-6 h-screen overflow-hidden">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black font-bold">Chat</h1>

            </header>
          
            <ChatWindow
      endpoint="api/chat/retrieval"
      
      // showIngestForm={true}
      placeholder={
        'Ask me anything about the document'
      }
      emoji="🐶"
      titleText="Flawless Introvert"
    ></ChatWindow>
          
          
        

          </div>
        </main>
      </div>
    </div>
  );
}

export default page