import React, { useState } from "react";

import { auth } from '@clerk/nextjs/server';

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getChatsByUserId } from "@/lib/actions/chat.action";
import ChatUI from "@/components/shared/ChatUI";

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

  const { success, data } = await getChatsByUserId({ userId }) as { success: boolean; data: string | null };
  const chats = data ? JSON.parse(data) : null;

  if (!success) {
    return redirect("/");
  }

  if (!chats || !chats.find((chat: any) => chat._id.toString() === id.toString())) {
    return redirect("/");
  }

  const currentChat = chats.find((chat: any) => chat._id.toString() === id.toString());
  console.log("why",currentChat);
  const isPdfVisible = false;

  // const [isPdfVisible, setPdfVisible] = useState(false);

  // const handleSelectPdf = () => {
  //   setPdfVisible(!isPdfVisible);
  // };

  return (
    <div>
<ChatUI  chats={chats} currentChat={currentChat} isPdfVisible={false}/>
    </div>
  );
};

export default Page;
