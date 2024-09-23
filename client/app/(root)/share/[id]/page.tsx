import React, { useState } from "react";

import { auth } from '@clerk/nextjs/server';

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getChatsByUserId,getSharedChatDetails } from "@/lib/actions/chat.action";
import ChatShare from "@/components/shared/chat/ChatShare";

export const metadata: Metadata = {
  title: "Chats",
};

interface Props {
  params: {
    id: string;
  };
}

const Page = async({params:{id}}: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }




   const currentChatDetails = await getSharedChatDetails(id);
   const currentChat = {_id:id,...currentChatDetails};
  console.log("why",currentChat,currentChatDetails);
  const isPdfVisible = false;


  return (
    <div>
<ChatShare   currentChat={currentChat} isPdfVisible={false}/>
    </div>
  );
};

export default Page;
