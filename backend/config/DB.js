import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const DBs = process.env.MONGO_DB_LOCAL || process.env.MONGO_DB;

async function connectDB() {
  try {
    await mongoose.connect(DBs);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

export default connectDB;
