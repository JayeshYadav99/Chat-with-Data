import { Schema, model, models, Document } from "mongoose";

export interface IChat extends Document {
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  userId: Schema.Types.ObjectId;
  fileKey: string;
  source: string;
  messages: Schema.Types.ObjectId[]; // Array of references to Message model
  isPublic: boolean; // New field to indicate if the chat is public
}

const ChatSchema = new Schema<IChat>({
  pdfName: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileKey: { type: String, required: true },
  source: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }], // Array of ObjectId referencing Message model
  isPublic: { type: Boolean, default: false }, // New boolean field with default value set to false
});

const Chat = models?.Chat || model<IChat>("Chat", ChatSchema);

export default Chat;
