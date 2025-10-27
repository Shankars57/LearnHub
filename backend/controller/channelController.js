import Channel from "../models/channel.js";

const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];

export const getChannels = async () => {
  let channels = await Channel.find({});
  for (const roomName of defaultRooms) {
    const exists = channels.find(
      (c) => c.name.toLowerCase() === roomName.toLowerCase()
    );
    if (!exists) {
      const newRoom = new Channel({
        name: roomName,
        admin: "System",
        messages: [{ user: "System", text: `Welcome to ${roomName} channel!` }],
      });
      await newRoom.save();
    }
  }
  channels = await Channel.find({});
  return channels;
};

export const createRoom = async ({ name, user, password }) => {
  const exists = await Channel.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });
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

export const deleteRoom = async ({ roomId, user }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");
  if (defaultRooms.includes(channel.name.toLowerCase()))
    throw new Error("Cannot delete default rooms!");
  if (channel.admin !== user)
    throw new Error("Only the room creator can delete this room!");
  await Channel.findByIdAndDelete(roomId);
  return roomId;
};

export const addMessage = async ({ roomId, message }) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");
  channel.messages.push(message);
  await channel.save();
  return message;
};

export const getChatHistory = async (roomId) => {
  const channel = await Channel.findById(roomId);
  if (!channel) throw new Error("Room not found!");
  return channel.messages;
};
