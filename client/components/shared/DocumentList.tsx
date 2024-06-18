
import React, { Key } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { MessageCircle,Trash2 } from "lucide-react";
import { IChat } from "@/lib/db/models/chat.model";

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
}
export default   function DocumentList({ chats, chatUrl }: Props) {

  const handleDelete = async(chatId: string,fileUrl:string) => {
    console.log("Deleting chat", chatId, fileUrl);
    const response = await axios.post("/api/delete-chat", {
   chatId,
   chatUrl
    });
    
   
    // const result = await DeleteChatById({ chatId, chatUrl:fileUrl });
    // if (result.success) {
    //   console.log("Chat deleted successfully")
    //   // Update state to remove the chat from the list
    //   // setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
    // } else {
    //   // Handle the error appropriately (e.g., show a notification)
    //   console.error("Failed to delete the chat");
    // }
    // Perform the deletion logic here
    // For example, make an API call to delete the chat from the server
    // Then update the state to remove the chat from the list

  };
  return (
    <div className="mt-4">
     {chats.map((chat) => (
        <div
          key={chat?._id as Key}
          className={cn("rounded-lg p-3 text-slate-300 flex items-center justify-between", {
            "bg-blue-600 text-white": chat.pdfUrl === chatUrl,
            "hover:text-white": chat.pdfUrl !== chatUrl,
          })}
        >
          <Link href={`/chat/${chat?._id}`} className="flex items-center w-full">
            <MessageCircle className="mr-2" />
            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
              {chat.pdfName}
            </p>
          </Link>
          <button
            onClick={() => handleDelete(chat._id as string, chat.pdfUrl as string)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <Trash2 />
          </button>
        </div>
      ))}
    </div>
  );
}
