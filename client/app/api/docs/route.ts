import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createChat } from "@/lib/actions/chat.action";
import { loadDocsintoVectorDatabase } from "@/lib/VectorDatabase";
import { LoadWebDocs } from "@/lib/Loaders";
// /api/create-chat
export async function POST(req: Request, res: Response) {
  console.log("create-chat");
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {  url } = body;

    const path = await LoadWebDocs(url);
    const NewChat = await createChat({
      file_key:url,
      file_name:url,
      userId,
      url,
      path:url,
    });

    return NextResponse.json(
      {
        path
        // chatId: NewChat?._id,
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
