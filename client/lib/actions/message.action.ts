"use server"

import { connectToDatabase } from "@/lib/db";
import Chat from "@/lib/db/models/chat.model";
import { handleError } from "@/lib/utils";
import User from "../db/models/user.model";
import Message from "../db/models/message.model";

export async function createMessage(params: any) {

    try {
      await connectToDatabase();

      const { chatId,content,role,userId} = params;
      const user = await User.findOne({_id: userId });
      if (!user) throw new Error("User not found");
  
      const newMessage = await Message.create({
        chatId,
        content,
        role
      });
      const chat = await Chat.findById(chatId);
      if (!chat) throw new Error("Chat not found");
  
      chat.messages.push(newMessage._id); // Push the new message ID into the messages array
      await chat.save(); // Save the updated chat
  
      return JSON.parse(JSON.stringify(newMessage));
    } catch (error) {
      handleError(error);
    }
  }

  export async function clearMessages(chatId: string) {
    try {
      await connectToDatabase();
      
      // Find and delete all messages with the given chatId
     
      const result = await Message.deleteMany({ chatId });
      console.log("result",result)
      
      if (result.deletedCount > 0) {
        return { success: true, message: `Deleted ${result.deletedCount} messages from chat ${chatId}` };
      } else {
        return { success: false, message: `No messages found for chat ${chatId}` };
      }
    } catch (error) {
      console.log(error)
      handleError(error);
      return { success: false, message: "An error occurred while clearing messages" };
    }
  }
  export async function getMessagesForChatId(chatId: string) {
    try {
      await connectToDatabase();
  
      // Find the chat by its ID and populate the messages array with Message data
      const chat = await Chat.findById(chatId)
        .populate({
          path: 'messages', 
          select: 'content role  ',
          options: { sort: { createdAt: 1 } }, 
        }) 
        if(!chat) throw new Error("Chat not found");
        const chatmessages = chat.messages.map((message: any) => ({
          id: message._id.toString(), // Add the id field with string representation of _id
          content: message.content,
          role: message.role,
        }));
        
      if ( chat.messages.length > 0) {
        return { success: true, messages: JSON.parse(JSON.stringify(chatmessages)) };
      } else {
        return { success: false, message: `No messages found for chat ${chatId}` };
      }
    } catch (error) {
      handleError(error);
      return { success: false, message: "An error occurred while fetching messages" };
    }
  }
  export async function replicateMessages(originalChatId: string, newChatId: string) {
    try {
      await connectToDatabase();
  
      const originalMessagesResult = await getMessagesForChatId(originalChatId);
  
      if (!originalMessagesResult.success) {
        throw new Error(originalMessagesResult.message);
      }
  
      const originalMessages = originalMessagesResult.messages;
  
      const newMessages = await Promise.all(originalMessages.map(async (msg: { content: string; role: string }) => {
        const newMessage = new Message({
          chatId: newChatId,
          content: msg.content,
          role: msg.role,
          createdAt: new Date(),
        });
        await newMessage.save();
        return newMessage._id;
      }));
  
      await Chat.findByIdAndUpdate(newChatId, { $push: { messages: { $each: newMessages } } });
  
      return { success: true, message: "Messages replicated successfully" };
    } catch (error) {
      handleError(error);
      return { success: false, message: "An error occurred while replicating messages" };
    }
  }
  