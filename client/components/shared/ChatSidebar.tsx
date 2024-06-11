"use client";

import {Button} from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle, PlusCircle } from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";
import DocumentList from "./DocumentList";


export default function ChatSidebar() {

  return (
     <div className="w-1/4  p-6 max-h-screen  bg-black  p-4 text-gray-200">
 
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat

        </Button>
      </Link>
              <DocumentUploadForm />
 
{/* <DocumentList/> */}
    </div>
  )
}
