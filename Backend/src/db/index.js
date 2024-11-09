import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI ?? "mongodb+srv://ribhugautam:%40HAte8989@cluster0.azhvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"}/${DB_NAME}`
    );
    console.log("MongoDB Connected", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection error", error);
    process.exit(1);
  }
};

export default connectDB;