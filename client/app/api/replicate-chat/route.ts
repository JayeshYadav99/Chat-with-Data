import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createChat } from "@/lib/actions/chat.action";
import { replicateMessages } from "@/lib/actions/message.action";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("body", body);
    const { _id, pdfName, pdfUrl, fileKey, source } = body.originalChat;

    // Create a new chat based on the original chat
    const newChat = await createChat({
      file_key: fileKey,
      file_name: pdfName,
      userId,
      url: pdfUrl,
      path: source,
    });

    if (!newChat) {
      throw new Error("Failed to create new chat");
    }

    // Replicate messages from the original chat
    const replicationResult = await replicateMessages(_id, newChat._id);

    if (!replicationResult.success) {
      throw new Error(replicationResult.message);
    }

    return NextResponse.json(
      {
        success: true,
        newChatId: newChat._id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error replicating chat:", error);
    return NextResponse.json(
      { error: "Failed to replicate chat" },
      { status: 500 },
    );
  }
}
