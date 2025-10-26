import mongoose from "mongoose";

// Each message inside a channel
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Each channel (room) schema
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admin: { type: String },
  password: { type: String, default: null },
  messages: [messageSchema],
});

// Export Channel model
const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
