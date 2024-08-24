import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.mongodb_uri);
    console.log("Connected to DB successfully");
    console.log("Connection Instance Host", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error in connecting to DB", error.message);
    process.exit(1); // exit current process
  }
};

export const connect = connectDB;