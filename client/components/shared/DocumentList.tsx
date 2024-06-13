import React, { Key } from "react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { IChat } from "@/lib/db/models/chat.model";
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
export default function DocumentList({ chats, chatUrl }: Props) {
  return (
    <div className="mt-4">
      {chats.map((chat) => (
        <Link key={chat?._id as Key} href={`/chat/${chat?._id}`}>
          <div
            className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
              "bg-blue-600 text-white": chat.pdfUrl === chatUrl,
              "hover:text-white": chat.pdfUrl !== chatUrl,
            })}
          >
            <MessageCircle className="mr-2" />
            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
              {chat.pdfName}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
