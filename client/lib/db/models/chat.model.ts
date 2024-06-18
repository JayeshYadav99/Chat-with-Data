import { Schema, model, models, Document } from "mongoose";

export interface IChat extends Document {
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
  fileKey: string;
  source: string;
}

const ChatSchema = new Schema<IChat>({
  pdfName: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileKey: { type: String, required: true },
  source : { type: String, required: true },
});


const Chat = models.Chat || model<IChat>('Chat', ChatSchema);
// console.log("Chat Model", Chat)

export default Chat;
