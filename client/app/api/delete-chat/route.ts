import { NextResponse } from "next/server";
import Chat from "@/lib/db/models/chat.model";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { DeleteChatById } from "@/lib/actions/chat.action";
// /api/create-chat
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chatId, chatUrl } = body;
    const response = await DeleteChatById({ chatId, chatUrl });
    const { data } = response;

    revalidatePath(`/chat/${data}`);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
