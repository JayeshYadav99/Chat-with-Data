import React from "react";

import PdfViewer from "@/components/shared/PDFViewer";
import { auth } from '@clerk/nextjs/server';
import ChatWindow from "@/components/shared/Chatwindow";
import ChatSidebar from "@/components/shared/ChatSidebar";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getChatsByUserId } from "@/lib/actions/chat.action";
export const metadata: Metadata = {
  title: "Chats",
};
interface Props {
    params: {
        id: string;
    };
    }

const page = async({params:{id}}:Props) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
      }

      const {success,data} = await getChatsByUserId({userId}) as { success: boolean; data: string | null };

      const chats= data ? JSON.parse(data) : null;
      if(!success)
        {
            return  redirect("/");
        }
        if (!chats || !chats.find((chat: any) => chat._id.toString() === id.toString())) {
          
            return redirect("/");
        }
        const currentChat=chats.find((chat:any) => chat._id.toString() === id.toString());
       console.log(currentChat)
  return (
    <div>
      <div className="flex h-screen ">
        <ChatSidebar  chats={chats} chatUrl={currentChat?.pdfUrl}/>

        <main className="w-3/4 flex">
          <div className="w-1/2 border-black border-4 p-6">
            <section className="  h-screen overflow-hidden">
              <header className="flex justify-between items-center ">
                <h1 className="text-2xl text-black font-bold">PDF Preview</h1>
              </header>

              <div className="flex justify-center items-center w-full h-full">
                <PdfViewer
                  previewUrl={
                    currentChat?.pdfUrl
                  }
                />
              </div>
            </section>
          </div>
          <div className="w-1/2   border-black border-4  p-6 h-screen overflow-hidden">
            {/* <header className="flex justify-between items-center mb-6">
              <h1 className="text-2xl text-black font-bold">Chat</h1>
            </header> */}

            <ChatWindow
              endpoint="/api/chat/retrieval"
         
              placeholder={"Ask me anything about the document"}
              emoji="🤖"
              titleText="AI Document Chat"
              chatSource={currentChat?.source}
            ></ChatWindow>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
