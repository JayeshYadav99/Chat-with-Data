import { Schema, model, models,Document } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    username: string;
    picture: string;
 
}


const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
})

const User = models.User || model('User', UserSchema);

export default User;