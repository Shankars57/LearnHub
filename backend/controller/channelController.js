import Channel from "../models/Channel.js";

// Get all channels
export const getChannels = async () => {
  return await Channel.find({});
};

// Create a new room
export const createRoom = async ({ name, user, password }) => {
  const exists = await Channel.findOne({ name });
  if (exists) throw new Error("Room already exists!");

  const newChannel = await Channel.create({
    name,
    admin: user,
    password: password || null,
    messages: [
      { user: "System", text: `Welcome to ${name}! (Admin: ${user})` },
    ],
  });

  return newChannel;
};

// Delete a room
export const deleteRoom = async ({ roomId, user }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");

  const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];
  if (defaultRooms.includes(channel.name.toLowerCase())) {
    throw new Error("Cannot delete default rooms!");
  }

  if (channel.admin !== user)
    throw new Error("Only admin can delete this room!");

  await Channel.findByIdAndDelete(roomId);
  return channel.id;
};

// Add a message
export const addMessage = async ({ roomId, message }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");

  channel.messages.push(message);
  await channel.save();
  return message;
};

// Get chat history
export const getChatHistory = async (roomId) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");
  return channel.messages;
};
