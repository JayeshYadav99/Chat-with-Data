"use client";

import {Button} from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { MessageCircle, PlusCircle } from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentList from "./DocumentList";
import {IChat} from "@/lib/db/models/chat.model";

interface Props{
  chats:Partial<IChat>[];
  chatUrl:string;
}

export default function ChatSidebar({chats,chatUrl}:Props) {


  return (
     <div className="w-1/4  p-6 max-h-screen  bg-black  p-4 text-gray-200">
 
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat

        </Button>
      </Link>
      {/* <DocumentUploadForm  /> */}
      
      <DocumentList  chatUrl={chatUrl} chats={chats} />


          
 
{/* <DocumentList/> */}
    </div>
  )
}
