import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: String },
  password: { type: String, default: null },
  messages: [messageSchema],
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
