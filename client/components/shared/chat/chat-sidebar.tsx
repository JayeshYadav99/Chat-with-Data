"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import DocumentList from "./document-list";
import { IChat } from "@/lib/db/models/chat.model";

interface Props {
  chats: Partial<IChat>[];
  chatUrl: string;
  onSelectPdf: () => void;
  isPdfVisible: boolean;
}

export default function ChatSidebar({
  chats,
  chatUrl,
  isPdfVisible,
  onSelectPdf,
}: Props) {
  return (
    <div className="w-1/4   max-h-screen  bg-black  p-4 text-gray-200">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <DocumentList
        chatUrl={chatUrl}
        chats={chats}
        onSelectPdf={onSelectPdf}
        isPdfVisible={isPdfVisible}
      />
    </div>
  );
}
