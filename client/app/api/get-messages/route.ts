import { NextResponse } from "next/server";
import { getMessagesForChatId } from "@/lib/actions/message.action";
export const runtime = "edge";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  const messages = await getMessagesForChatId(chatId);
  return NextResponse.json(messages);
};
