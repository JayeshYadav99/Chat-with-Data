import { streamText, StreamData } from "ai";
import { TaskType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { google } from "@ai-sdk/google";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { Googlemodel } from "@/lib/rag/model";
import { createOpenAI } from "@ai-sdk/openai";

import { createMessage } from "@/lib/actions/message.action";

import { Document } from "@langchain/core/documents";
import { condenseQuestionPrompt } from "@/lib/rag/prompts";
import {
  BytesOutputParser,
  StringOutputParser,
} from "@langchain/core/output_parsers";
type VercelChatMessage = {
  role: string;
  content: string;
};

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
  const formattedDialogueTurns = chatHistory.map((message) => {
    if (message.role === "user") {
      return `Human: ${message.content}`;
    } else if (message.role === "assistant") {
      return `Assistant: ${message.content}`;
    } else {
      return `${message.role}: ${message.content}`;
    }
  });
  return formattedDialogueTurns.join("\n");
};

const combineDocumentsFn = (docs: Document[]) => {
  const serializedDocs = docs.map((doc) => doc.pageContent);
  return serializedDocs.join("\n\n");
};
const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body", body);
  const messages = body.messages ?? [];
  const { source, chatId, userId } = body;
  console.log("source", source, "user", userId, "chat", chatId);
  const previousMessages = messages.slice(0, -1);
  const currentMessageContent = messages[messages.length - 1].content;
  await createMessage({
    chatId: chatId,
    content: currentMessageContent,
    role: "user",
    userId: userId,
  });
  console.log(messages);

  //Intializing Supabase Client
  const client = createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_PRIVATE_KEY ?? ""
  );

  //Calling vectorstore
  const vectorstore = new SupabaseVectorStore(
    new GoogleGenerativeAIEmbeddings({
      model: "embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document Embeddings",
    }),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  //
  const standaloneQuestionChain = RunnableSequence.from([
    condenseQuestionPrompt,
    Googlemodel,
    new StringOutputParser(),
  ]);

  let resolveWithDocuments: (value: Document[]) => void;
  const documentPromise = new Promise<Document[]>((resolve) => {
    resolveWithDocuments = resolve;
  });
  const retriever = vectorstore.asRetriever({
    filter: { source: source },
    callbacks: [
      {
        handleRetrieverEnd(documents) {
          console.log("documents scanned", documents, "for", source);
          resolveWithDocuments(documents);
          //   resolveWithDocuments(documents);
        },
      },
    ],
  });
  const retrievalChain = retriever.pipe(combineDocumentsFn);
  const context = await retrievalChain.invoke(currentMessageContent);
  const history = formatVercelMessages(messages);
  // console.log("context",context);
  const prompt = {
    role: "user",
    content: `

AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.


   .

    `,
  };
  // const modifiedMessages = messages.map((message: any, index: any) => {
  //   if (index === messages.length - 1) {
  //     return {
  //       ...message,
  //       role: prompt.role, // Modify the role of the last message
  //       content: `  ${prompt.content}`, // Replace the content with the provided prompt
  //     };
  //   }
  //   return message; // Return other messages as they are
  // });

  const data = new StreamData();
  const documents = await documentPromise;
  const serializedSources = Buffer.from(
    JSON.stringify(
      documents.map((doc) => {
        return {
          pageContent: doc.pageContent.slice(0, 50) + "...",
          metadata: doc.metadata,
        };
      })
    )
  ).toString("base64");

  // Append additional data
  data.append({
    messageindex: (previousMessages.length + 1).toString(),
    sources: serializedSources,
  });
  const result = await streamText({
    model: groq("llama3-8b-8192"),
    system: "You are a helpful assistant.",
    messages: [
      prompt,
      ...messages.filter((message: any) => message.role === "user"),
    ],

    async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      data.close();
      console.log("output", text);
      await createMessage({
        chatId: chatId,
        content: text,
        role: "assistant",
        userId: userId,
      });
      // return { text, toolCalls, finishReason, usage };
      // your own logic, e.g. for saving the chat history or recording usage
    },
  });

  return result.toDataStreamResponse({
    init: {
      headers: {
        messageindex: (previousMessages.length + 1).toString(),
        sources: serializedSources, // Pass the source here
      },
    },

    data,
  });
}
