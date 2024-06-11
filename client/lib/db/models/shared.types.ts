import {Schema} from "mongoose";
import {IUser} from "./user.model";
import {model} from "mongoose";

export interface CreateUserParams{
    clerkId: string;
    email: string;
    username: string;
    picture: string;
}
export interface UpdateUserParams{
    clerkId: string;
    Updateduser: Partial<IUser>;
    path: string;
   
}
export interface GetUserByIdParams{
    userId: string;
}
export interface DeleteUserParams{
    clerkId: string;
}