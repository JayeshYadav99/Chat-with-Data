"use client";

import { useChat } from "ai/react";
import { Loader2, RefreshCw, Share2, User, Bot, FileText } from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { clearMessages } from "@/lib/actions/message.action";
import { ChatMessageBubble } from "@/components/shared/chat/chat-bubble";
import { useToast } from "@/components/hooks/use-toast";
import { getMessagesForChatId } from "@/lib/actions/message.action";
import ShareChatModal from "../modal/ShareChatModal";
import SharedChatReplication from "./share-chat-replicate";
interface Props {
  chatSource: string;
  currentChat: any;
  isShare: any;
}

export default function ChatInterface({
  chatSource,
  currentChat,
  isShare,
}: Props) {
  const { toast } = useToast();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const skeletonMessages = [
    { id: "skeleton-1", role: "user" as const, content: "" },
    { id: "skeleton-2", role: "assistant" as const, content: "" },
    { id: "skeleton-3", role: "user" as const, content: "" },
    { id: "skeleton-4", role: "assistant" as const, content: "" },
  ];
  const placeholder = "Ask me anything about the document";
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data,
    setMessages,
    isLoading,
  } = useChat({
    api: "/api/completion",
    body: {
      source: chatSource,
      userId: currentChat.userId,
      chatId: currentChat._id,
    },
    initialMessages,

    onResponse(response) {
      // console.log("response", messages);
      // console.log("response", response);
      const sourcesHeader = response.headers.get("sources");
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
        : [];
      const messageIndexHeader = response.headers.get("messageindex");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
  });
  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    // console.log("callled------------->");
    // setMessages(messages.concat({ id: messages.length.toString(), content: input, role: "user" }));
    handleSubmit(e);
  };
  const resetChat = async () => {
    try {
      console.log("clearing chat");
      const response = await clearMessages(currentChat._id);
      console.log("response", response);
      if (response.success) {
        toast({
          title: "Chat Cleared Successfully",
          description: "You can now start a new chat.",
        });
        console.log("chat cleared");
        setMessages([]);
        setSourcesForMessages({});
      } else {
        console.error("Failed to clear the chat");
        toast({
          title: "Failed to clear the chat",
          description: "Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await getMessagesForChatId(currentChat._id);
        if (response.success) {
          console.log(response.messages);
          setInitialMessages(response.messages);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [currentChat._id]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center max-h-[95vh] md:p-8 rounded ">
      <div className="flex justify-between w-full mb-4">
        {!isShare ? (
          <>
            <Button onClick={resetChat} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4 text-green-500" />
              Reset Chat
            </Button>
            <ShareChatModal chatId={currentChat._id} messages={messages} />
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        ref={messageContainerRef}
        className="flex flex-col w-full overflow-y-auto mb-4 transition-[flex-grow]  ease-in-out"
      >
        {isLoadingMessages
          ? skeletonMessages.map((m) => (
              <ChatMessageBubble
                key={m.id}
                message={m}
                aiEmoji="🤖"
                sources={[]}
                isLoading={true}
              ></ChatMessageBubble>
            ))
          : [...messages].map((m, i) => (
              <ChatMessageBubble
                key={m.id}
                message={m}
                aiEmoji="🤖"
                sources={sourcesForMessages[i.toString()]}
              />
            ))}
      </div>

      {!isShare ? (
        <form
          onSubmit={sendMessage}
          className="flex  items-center  w-full flex-col"
        >
          <div className="flex w-full  ">
            <input
              className=" grow bg-slate-500 mr-4 p-4 rounded"
              name="prompt"
              id="input"
              value={input}
              placeholder={placeholder ?? "What's it like to be a pirate?"}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="shrink-0  bg-sky-600  w-28 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin" />
                </>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      ) : (
        <SharedChatReplication originalChat={currentChat} />
      )}
    </div>
  );
}
