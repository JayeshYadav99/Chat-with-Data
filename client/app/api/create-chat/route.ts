import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createChat } from "@/lib/actions/chat.action";
import { loadDocsintoVectorDatabase } from "@/lib/VectorDatabase";
// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId, getToken } = auth();
  const template = 'supabase'

  const token = await getToken({ template });
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name, url, file_type } = body;
    const path = await loadDocsintoVectorDatabase(file_key, file_type, token);
    const NewChat = await createChat({
      file_key,
      file_name,
      userId,
      url,
      path,
    });

    return NextResponse.json(
      {
        chatId: NewChat?._id,
        // chat_id: chat_id[0].insertedId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
