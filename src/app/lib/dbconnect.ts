import mongoose from "mongoose";

let isConnected = false;

export const dbconnect = async () => {
  if (isConnected) {
    return;
  }

  const MONGO_URL = process.env.MONGO_URL;

  if (!MONGO_URL) {
    throw new Error("Please define the MONGO_URL environment variable");
  }

  try {
    await mongoose.connect(MONGO_URL);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    throw error;
  }
};