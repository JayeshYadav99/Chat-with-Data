import { connectToDatabase } from "@/lib/db";
import Chat from "@/lib/db/models/chat.model";
import { handleError } from "@/lib/utils";
import User from "../db/models/user.model";

interface CreateChatParams {
  file_key: string;
  file_name: string;
  userId: string;
  url: string;
}

export async function createChat(params: CreateChatParams) {
  try {
    await connectToDatabase();
    const { file_key, file_name, userId, url } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const newChat = await Chat.create({
      pdfName: file_name,
      pdfUrl: url,
      userId: user._id,
      fileKey: file_key,
    });
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
  
    const chats = await Chat.find({ userId: user._id });
    const transformedChats = chats.map(chat => ({
      

      _id: chat._id.toString(),
      pdfName: chat.pdfName,
      pdfUrl: chat.pdfUrl,
      fileKey: chat.fileKey,
      userId: chat.userId.toString(),
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
    const chat = await Chat.findOne({ userId: user._id });
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