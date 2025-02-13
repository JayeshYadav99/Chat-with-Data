"use client";

import type { Key } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { MessageCircle, Trash2 } from "lucide-react";
import type { IChat } from "@/lib/db/models/chat.model";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { truncateText } from "@/lib/utils";
import { useToast } from "@/components/hooks/use-toast";
import axios from "axios";

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
    <div className="flex flex-col gap-1 mt-4">
      {chats &&
        chats.map((chat) => (
          <div
            key={chat?._id as Key}
            className={cn(
              "relative rounded-lg p-3 text-slate-300 transition-all duration-200 ease-in-out",
              {
                "bg-blue-600/90 text-white shadow-lg": chat.pdfUrl === chatUrl,
                "hover:bg-slate-800": chat.pdfUrl !== chatUrl,
              }
            )}
          >
            <Link
              href={`/chat/${chat?._id}`}
              className="flex items-center w-full group/item"
            >
              <div className="flex items-center min-w-0 flex-1">
                <MessageCircle
                  className={cn(
                    "mr-3 h-4 w-4 flex-shrink-0",
                    chat.pdfUrl === chatUrl ? "text-white" : "text-slate-400"
                  )}
                />
                <p className="truncate text-sm font-medium">
                  {truncateText(chat.pdfName ?? "", 30)}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(chat._id as string, chat.pdfUrl as string);
                  }}
                  className={cn(
                    "p-1 rounded-md hover:bg-slate-700/50 transition-colors",
                    chat.pdfUrl === chatUrl
                      ? "text-white/80 hover:text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  className={cn(
                    "p-1 rounded-md hover:bg-slate-700/50 transition-colors",
                    chat.pdfUrl === chatUrl
                      ? "text-white/80 hover:text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPdf();
                  }}
                  aria-label={isPdfVisible ? "Hide PDF" : "Show PDF"}
                >
                  {isPdfVisible && chat.pdfUrl === chatUrl ? (
                    <FaEye className="h-4 w-4" />
                  ) : (
                    <FaEyeSlash className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
