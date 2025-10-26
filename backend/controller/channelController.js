import Channel from "../models/Channel.js";

// Default system-created channels
const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];
// Fetch all existing channels (creates defaults if missing)
export const getChannels = async () => {
  let channels = await Channel.find({});
  // Ensure default rooms always exist
  for (const name of defaultRooms) {
    if (!channels.find((c) => c.name.toLowerCase() === name)) {
      const newRoom = new Channel({
        name,
        admin: "System",
        messages: [{ user: "System", text: `Welcome to ${name} channel!` }],
      });
      await newRoom.save();
    }
  }
  channels = await Channel.find({});
  return channels;
};
// Create a new custom room
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
// Delete a room (only admin can delete, system rooms are protected)
export const deleteRoom = async ({ roomId, user }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");

  if (defaultRooms.includes(channel.name.toLowerCase())) {
    throw new Error("Cannot delete default rooms!");
  }
  if (channel.admin !== user)
    throw new Error("Only the room creator can delete this room!");
  await Channel.findByIdAndDelete(roomId);
  return roomId;
};

// Add a new message to a specific room
export const addMessage = async ({ roomId, message }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");

  channel.messages.push(message);
  await channel.save();
  return message;
};

// Get message history for a room
export const getChatHistory = async (roomId) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");
  return channel.messages;
};
