import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getChatsByUserId } from "@/lib/actions/chat.action";
import ChatUI from "@/components/shared/chat/chat-ui";
import { ChatResponse, ChatMessage } from "@/types/chat";



export const metadata: Metadata = {
  title: "Chats",
};

interface Props {
  params: {
    id: string;
  };
}

const Page = async ({ params: { id } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { success, data } = (await getChatsByUserId({
    userId,
  })) as ChatResponse;
  const chats = data ? JSON.parse(data) : null;

  if (!success) {
    return redirect("/");
  }

  if (
    !chats ||
    !chats.find((chat: ChatMessage) => chat._id.toString() === id.toString())
  ) {
    return redirect("/");
  }

  const currentChat = chats.find(
    (chat: ChatMessage) => chat._id.toString() === id.toString()
  );

  return (
    <div>
      <ChatUI chats={chats} currentChat={currentChat} />
    </div>
  );
};

export default Page;
