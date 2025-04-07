"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import ChatSidebar from "@/components/shared/chat/chat-sidebar";
import PdfViewer from "@/components/shared/chat/pdf-viewer";
import ChatPanel from "@/components/shared/chat/chat-panel";
import { ChatMessage } from "@/types/chat";
const ChatUI = ({ chats, currentChat }: { chats: ChatMessage[]; currentChat: ChatMessage }) => {
  const [isPdfVisible, setPdfVisible] = useState(false);
  const isPdfSource = currentChat?.source?.endsWith(".pdf");
  const handleSelectPdf = () => {
    setPdfVisible(!isPdfVisible);
  };
  return (
    <div>
      <div className="flex h-screen">
        <ChatSidebar
          chats={chats}
          chatUrl={currentChat?.pdfUrl}
          onSelectPdf={handleSelectPdf}
          isPdfVisible={isPdfVisible}
        />

        <main
          className={`flex ${isPdfVisible ? "w-3/4" : "w-full"
            } transition-all duration-300`}
        >
          <motion.div
            className="flex"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: isPdfVisible ? "50%" : "0%",
              opacity: isPdfVisible ? 1 : 0,
            }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isPdfVisible && (
              <div className="w-full border-black border-4 p-6">
                <header className="flex justify-center items-center">
                  <h1 className="text-2xl text-black font-bold text-center">
                    {isPdfSource ? "PDF Preview" : "Web Docs Preview"}
                  </h1>
                </header>
                <div className="h-[calc(100%-2rem)] overflow-hidden p-2">
                  <PdfViewer previewUrl={currentChat?.pdfUrl} />
                </div>
              </div>
            )}
          </motion.div>

          <div
            className={`${isPdfVisible ? "w-1/2" : "w-full"
              }  p-2 h-screen overflow-hidden`}
          >
            <ChatPanel
              chatSource={currentChat?.source}
              currentChat={currentChat}
              isShare={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatUI;
