import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_LOCAL);
    console.log("DB connected");
  } catch (error) {
    console.log(error.message);
  }
}

export default connectDB;
