"use client";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, ReactElement,useEffect } from "react";
import type { FormEvent } from "react";

import { ChatMessageBubble } from "./ChatMessageBubble";
import  DocumentUploadForm  from "./DocumentUploadForm";
import { IntermediateStep } from "./IntermediateSteps";
import type { AgentStep } from 'langchain/agents';

export default function ChatWindow(props: {
  
  endpoint: string,
  emptyStateComponent?: ReactElement,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean
  chatSource:string
}) {
// Add this line to destructure the setFilename function from props
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji, chatSource } = props;
  console.log(chatSource)

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);

  const ingest= showIngestForm && <DocumentUploadForm ></DocumentUploadForm>;
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)}></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages,data } =
    useChat
    (
      {
      api: endpoint,
      body: {
        source: chatSource,
      },
      onResponse(response) {
        console.log("response",messages)
        console.log("response",response)
    
      const sourcesHeader = response.headers.get("sources");
      const sources = sourcesHeader ? JSON.parse((Buffer.from(sourcesHeader, 'base64')).toString('utf8')) : [];
      const messageIndexHeader =  response.headers.get("messageindex");
      console.log("sources",sources)
      console.log("messageIndexHeader",messageIndexHeader)
        if (sources.length && messageIndexHeader !== null) {
          setSourcesForMessages({...sourcesForMessages, [messageIndexHeader]: sources});
        }
      },
      streamMode: "text",
      onError: (e) => {
        toast(e.message, {
          theme: "dark"
        });
      }
    });

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      console.log("callled------------->")
      
      if (messageContainerRef.current) {
        messageContainerRef.current.classList.add("grow");
      }
    
      if (!messages.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    
      if (chatEndpointIsLoading || intermediateStepsLoading) {
        return;
      }
    
      if (!showIntermediateSteps) {
        
        handleSubmit(e);
        return;
      } 
    
      setIntermediateStepsLoading(true);
      setInput("");
      
      const messagesWithUserReply = messages.concat({ id: messages.length.toString(), content: input, role: "user" });
      setMessages(messagesWithUserReply);
    
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      }
    
      const response = await fetch(endpoint, {

        method: "POST",
        body: JSON.stringify({
          messages: {messagesWithUserReply,chatSource},
      
          show_intermediate_steps: true
        })
      });
      alert("response")
      
      const json = await response.json();
      console.log("JSON",json)
      setIntermediateStepsLoading(false);

      if (response.status === 200) {
        const intermediateStepMessages = (json.intermediate_steps ?? []).map((intermediateStep: AgentStep, i: number) => {
          return { id: (messagesWithUserReply.length + i).toString(), content: JSON.stringify(intermediateStep), role: "system" };
        });
    
        const newMessages = [...messagesWithUserReply];
    
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
    
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
    
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
           console.log("newMessages",newMessages)
        setMessages([...newMessages, { id: (newMessages.length + intermediateStepMessages.length).toString(), content: json.output, role: "assistant" }]);
    
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      } else {
        if (json.error) {
toast(json.error, { theme: "dark" });
          throw new Error(json.error);
        }
      }
    }
    

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className={`flex flex-col items-center max-h-[89vh] md:p-8 rounded    ${(messages.length > 0 ? "border" : "")}`}>
      <h2 className={`${messages.length > 0 ? "" : "hidden"}  mb-4 text-black text-2xl`}>{emoji} {titleText}</h2>
      {messages.length === 0 ? emptyStateComponent : ""}
      <div
        className="flex flex-col-reverse w-full overflow-y-auto transition-[flex-grow]  ease-in-out"
        ref={messageContainerRef}
      >
        {messages.length > 0 ? (
          [...messages]
            .reverse()
            .map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return (m.role === "system" ? <IntermediateStep key={m.id} message={m}></IntermediateStep> : <ChatMessageBubble key={m.id} message={m} aiEmoji={emoji} sources={sourcesForMessages[sourceKey]}></ChatMessageBubble>)
            })
        ) : (
          ""
        )}
      </div>

      {messages.length === 0 && ingest}

      <form onSubmit={sendMessage} className="flex  items-center  w-full flex-col">
        <div className="flex">
          {intemediateStepsToggle}
        </div>
        <div className="flex w-full  ">
          <input
            className=" grow bg-slate-500 mr-4 p-4 rounded"
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <button type="submit" className="shrink-0 px-8 py-4 bg-sky-600 rounded w-28">
            <div role="status" className={`${(chatEndpointIsLoading || intermediateStepsLoading) ? "" : "hidden"} flex justify-center`}>
              <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span className={(chatEndpointIsLoading || intermediateStepsLoading) ? "hidden" : ""}>Send</span>
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
}
          