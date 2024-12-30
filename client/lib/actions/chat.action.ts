"use server"
import { connectToDatabase } from "@/lib/db";
import Chat from "@/lib/db/models/chat.model";
import { handleError } from "@/lib/utils";
import User from "../db/models/user.model";
import { del } from '@vercel/blob';
import { revalidatePath } from "next/cache";
interface CreateChatParams {
  file_key: string;
  file_name: string;
  userId: string;
  url: string;
  path: string;
}

export async function createChat(params: CreateChatParams) {
  try {
    await connectToDatabase();
    const { file_key, file_name, userId, url ,path} = params;
    console.log(params)
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const newChat = await Chat.create({
      pdfName: file_name,
      pdfUrl: url,
      userId: user._id,
      fileKey: file_key,
      source: path,
      messages:[],

    });
    console.log("New Chat",newChat)
    return JSON.parse(JSON.stringify(newChat));
  } catch (error) {
    handleError(error);
  }
}
interface getChatsByUserIdParams {
  userId: string;
}
export async function getChatsByUserId(params: getChatsByUserIdParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return {
        success: false,
        data: null,
      };
    }
  
    const chats = (await Chat.find({ userId: user._id }).sort({createdAt:-1}));
    const transformedChats = chats.map(chat => ({
      

      _id: chat._id.toString(),
      pdfName: chat.pdfName,
      pdfUrl: chat.pdfUrl,
      fileKey: chat.fileKey,
      userId: chat.userId.toString(),
      source:chat.source
    }));
    return {
      success: true,
      data: JSON.stringify(transformedChats),
    };
  } catch (error) {
    handleError(error);
  }
}

interface getFirstChatByUserId {
  userId: string;
}
export async function getFirstChatByUserId(params: getFirstChatByUserId) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return {
        success: false,
        data: null,
      };
    }
console.log("fetched user",user._id)
    const chat = await Chat.findOne({ userId: user._id }).sort({createdAt:-1});
    if (!chat) {
      return {
        success: false,
        data: null,
      };
    }
 
    return {
      success: true,
      data: chat._id.toString(),
    };
  }
  catch (error) { 
    console.log(error)
    handleError(error);
  }
}
interface DeleteChatParams {
  chatId: string;
  chatUrl: string;
}
export async function DeleteChatById(params: DeleteChatParams) {
  const { chatId, chatUrl} = params;
  
  try {
    await connectToDatabase();
console.log("chatId",chatId)
    // Delete chat from database
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      console.error("Chat not found")
      return {
        success: false,
        data: null,
      };
    }

    // Delete file from Vercel Blob Storage
    const deleteResponse = await del(chatUrl);
    revalidatePath(`/chat/${chat._id}`)
    return {
      success: true,
      data: chat._id.toString(),
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      data: null,
    };
  }
}
export async function getSharedChatDetails(chatId: string) {
  try {
    await connectToDatabase();

    const chat = await Chat.findOne({ _id: chatId, isPublic: true });

    if (!chat) {
      return null;
    }

    return {
      source: chat.source,
      fileKey: chat.fileKey,
      pdfUrl: chat.pdfUrl,
      pdfName: chat.pdfName
      // Add any other details you want to display
    };
  } catch (error) {
    console.error('Error fetching shared chat details:', error);
    return null;
  }
}
interface  UpdateChatStatusParams
{
  chatId: string;
  isPublic: boolean;
}
export async function updateChatStatus(params: UpdateChatStatusParams) {
  try {
    await connectToDatabase();
    const { chatId, isPublic } = params;
    console.log(params)

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { isPublic},
      { new: true }
    );

    if (!updatedChat) {
      return {
        success: false,
        message: "Chat not found",
      };
    }

    return {
      success: true,
      data: {
        id: updatedChat._id.toString(),
        isPublic: updatedChat.isPublic,
      },
    };
  } catch (error) {
    handleError(error);
    return {
      success: false,
      message: "Failed to update chat status",
    };
  }
}