import React, { Key } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Trash2 } from "lucide-react";
import { IChat } from "@/lib/db/models/chat.model";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { truncateText } from "@/lib/utils";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

interface Document {
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  url: string;
}
interface Props {
  chats: Partial<IChat>[];
  chatUrl: string;
  onSelectPdf: () => void;
  isPdfVisible: boolean;
}
export default function DocumentList({
  chats,
  chatUrl,
  onSelectPdf,
  isPdfVisible,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const handleDelete = async (chatId: string, fileUrl: string) => {
    try {
      console.log("Deleting chat", chatId, fileUrl);
      const response = await axios.post("/api/delete-chat", {
        chatId,
        chatUrl: fileUrl,
      });

      if (response.data.success) {
        toast({
          title: "Chat deleted",
          description: "The chat has been successfully deleted.",
        });
        router.refresh();
      } else {
        throw new Error(response.data.message || "Failed to delete chat");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        title: "Error",
        description: "Failed to delete the chat. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="mt-4">
      {chats &&
        chats.map((chat) => (
          <div
            key={chat?._id as Key}
            className={cn(
              "rounded-lg p-3 text-slate-300 flex items-center justify-between",
              {
                "bg-blue-600 text-white": chat.pdfUrl === chatUrl,
                "hover:text-white": chat.pdfUrl !== chatUrl,
              },
            )}
          >
            <Link
              href={`/chat/${chat?._id}`}
              className="flex items-center w-full"
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {truncateText(chat.pdfName ?? "", 25)}
              </p>
            </Link>
            <button
              onClick={() =>
                handleDelete(chat._id as string, chat.pdfUrl as string)
              }
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
            <button
              className="ml-2 p-1 rounded-md hover:bg-blue-500"
              onClick={onSelectPdf} // Trigger PDF visibility toggle
            >
              {isPdfVisible && chat.pdfUrl === chatUrl ? (
                <FaEye />
              ) : (
                <FaEyeSlash />
              )}{" "}
              {/* Toggle icon based on PDF visibility */}
            </button>
          </div>
        ))}
    </div>
  );
}
