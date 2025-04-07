import { TaskType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RunnableSequence } from "@langchain/core/runnables";
import { Googlemodel } from "@/lib/rag/model";
import { createOpenAI } from "@ai-sdk/openai";
import { createMessage } from "@/lib/actions/message.action";
import { Document } from "@langchain/core/documents";
import { condenseQuestionPrompt, answerPrompt } from "@/lib/rag/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { VercelChatMessage } from "@/types/chat";
import { LangChainAdapter } from "ai";

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

  const messages = body.messages ?? [];
  const { source, chatId, userId } = body;

  const previousMessages = messages.slice(0, -1);
  const currentMessageContent = messages[messages.length - 1].content;
  await createMessage({
    chatId: chatId,
    content: currentMessageContent,
    role: "user",
    userId: userId,
  });

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

  console.log("📝 Previous Messages:", previousMessages);

  const standaloneQuestionChain = RunnableSequence.from([
    {
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },

    condenseQuestionPrompt,
    Googlemodel,
    new StringOutputParser(),
  ]);

  let resolveWithDocuments: (value: Document[]) => void;
  const documentPromise = new Promise<Document[]>((resolve) => {
    resolveWithDocuments = resolve;
  });
  // Use standaloneQuestionChain to refine the current question

  console.log(" 🛠️  Generated refined question.");
  const retriever = vectorstore.asRetriever({
    filter: { source: source },
    callbacks: [
      {
        handleRetrieverEnd(documents) {
          console.log(" 📄 Retrieved relevant documents.");
          resolveWithDocuments(documents);
          //   resolveWithDocuments(documents);
        },
      },
    ],
  });
  const retrievalChain = retriever.pipe(combineDocumentsFn);
  const answerChain = RunnableSequence.from([
    {
      context: RunnableSequence.from([
        (input) => input.question,
        retrievalChain,
      ]),
      chat_history: (input) => input.chat_history,
      question: (input) => input.question,
    },
    answerPrompt,
    Googlemodel,
  ]);

  console.log(" 📌 Context constructed from document chunks.");

  const conversationalRetrievalQAChain = RunnableSequence.from([
    {
      question: standaloneQuestionChain,
      chat_history: (input) => input.chat_history,
    },
    answerChain,
    new StringOutputParser(),
  ]);

  const stream = await conversationalRetrievalQAChain.stream({
    question: currentMessageContent,
    chat_history: formatVercelMessages(previousMessages),
  });

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
  console.log(" 🚀 Stream Text function started generating response");

  const options = {
    callbacks: {
      onStart: async () => {
        console.log("🟢 Stream started");
      },
      onToken: async (token: string) => {
        console.log("🔤 Token received:", token);
      },
      onCompletion: async (completion: string) => {
        console.log("✨ Completion received:", completion);
      },
      onFinal: async (completion: string) => {
        console.log("🏁 Stream finished. Final completion:", completion);
        await createMessage({
          chatId: chatId,
          content: completion,
          role: "assistant",
          userId: userId,
        });
      },
    },
    init: {
      headers: {
        messageindex: (previousMessages.length + 1).toString(),
        sources: serializedSources,
      },
    },
  };

  return LangChainAdapter.toDataStreamResponse(stream, options);
}
