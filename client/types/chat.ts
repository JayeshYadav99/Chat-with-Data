import { IChat } from '@/lib/db/models/chat.model';
import { Types } from 'mongoose';

export interface ChatResponse {
  success: boolean;
  data: string | null;
}
export type VercelChatMessage = {
  role: string;
  content: string;
};
export type ChatMessage = IChat & { _id: Types.ObjectId };