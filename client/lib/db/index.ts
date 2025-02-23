"use server";
import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  console.log("MongoDB", process.env.MONGODB_URL);
  if (!process.env.MONGODB_URL) {
    return console.log("MONGODB_URL not found");
  }

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "chatwithdocs",
    });
    isConnected = true;

    console.log("MongoDB is connected");
  } catch (error) {
    console.log("MongoDb connection error", error);
  }
};
