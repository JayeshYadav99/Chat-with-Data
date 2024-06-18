
import { NextResponse } from "next/server";
import Chat from "@/lib/db/models/chat.model";
import { del } from '@vercel/blob';
import { revalidatePath } from "next/cache";
// /api/create-chat
export async function POST(req: Request, res: Response) {
try{

    const body = await req.json();
    const {chatId, chatUrl}=body;
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      return NextResponse.json({
        success: false,
        data: null,
      },
      {
        status:200
      }
    );
    }
     // Delete file from Vercel Blob Storage
     const deleteResponse = await del(chatUrl);


     revalidatePath(`/chat/${chat._id}`)
    return NextResponse.json(
      {
        data: chat._id.toString(),
        success:true
        // chat_id: chat_id[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}