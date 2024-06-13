import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an enum for the role field
enum UserRole {
  USER = 'user',
  SYSTEM = 'system',
 
}

// Define an interface representing a document in MongoDB.
interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId; // Reference to the chats collection
  content: string;
  createdAt: Date;
  role: UserRole;
}

// Create a Schema corresponding to the document interface.
const messageSchema: Schema<IMessage> = new Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true }
});

// Create a Mongoose model.
const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
