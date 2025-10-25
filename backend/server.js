import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import AIRouter from "./routes/aiRoute.js";
import connectDB from "./config/DB.js";
import pdfRouter from "./routes/materialRoute.js";
import userRouter from "./routes/userRoutes.js";
import ytRouter from "./routes/youtubeRoute.js";
import {
  createRoom,
  deleteRoom,
  addMessage,
  getChatHistory,
} from "./controller/channelController.js";
dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

const __dirname = path.resolve();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ---------------- Chat System ----------------
let channels = [
  {
    id: "general",
    name: "General",
    members: 0,
    messages: [{ id: 1, user: "System", text: "Welcome to General channel!" }],
  },
  {
    id: "dsa",
    name: "DSA Group",
    members: 0,
    messages: [{ id: 1, user: "System", text: "Discuss DSA problems here." }],
  },
  {
    id: "web",
    name: "Web Dev",
    members: 0,
    messages: [{ id: 1, user: "System", text: "Talk about web development." }],
  },
  {
    id: "aiml",
    name: "AI/ML",
    members: 0,
    messages: [{ id: 1, user: "System", text: "Share AI/ML resources." }],
  },
  {
    id: "system",
    name: "System Design",
    members: 0,
    messages: [
      { id: 1, user: "System", text: "Discuss system design concepts." },
    ],
  },
  {
    id: "career",
    name: "Career Advice",
    members: 0,
    messages: [
      { id: 1, user: "System", text: "Talk about career & interview tips." },
    ],
  },
];

// ---------------- Socket.io ----------------
io.on("connection", (socket) => {
  socket.emit("channels_list", channels);

  socket.on("create_room", ({ name, user, password }) => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    if (channels.find((c) => c.id === id)) {
      socket.emit("room_error", "Room already exists!");
      return;
    }
    const newRoom = {
      id,
      name,
      members: 0,
      admin: user,
      password: password || null,
      messages: [
        { id: 1, user: "System", text: `Welcome to ${name}! (Admin: ${user})` },
      ],
    };
    channels.push(newRoom);
    io.emit("channels_list", channels);
    socket.emit("room_created", newRoom);
  });

  socket.on("join_room", ({ roomId, user, password }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) {
      socket.emit("room_error", "Room not found!");
      return;
    }

    // Password check
    if (channel.password && channel.password !== password) {
      socket.emit("room_error", "Incorrect password!");
      return;
    }

    // Check if username already exists in the room
    const room = io.sockets.adapter.rooms.get(roomId);
    const usersInRoom = [];
    if (room) {
      for (const socketId of room) {
        const s = io.sockets.sockets.get(socketId);
        if (s?.data.user) usersInRoom.push(s.data.user);
      }
    }

    if (usersInRoom.includes(user)) {
      socket.emit("room_error", "Username is already in use in this room!");
      return;
    }

    // Join room
    socket.join(roomId);
    socket.data.user = user;

    // Update member count
    const updatedRoom = io.sockets.adapter.rooms.get(roomId);
    channel.members = updatedRoom ? updatedRoom.size : 1;

    // Send chat history to the new user
    socket.emit("receive_history", channel.messages);

    // Update channels list for all clients
    io.emit("channels_list", channels);
  });

  socket.on("leave_room", ({ roomId }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    socket.leave(roomId);

    const updatedRoom = io.sockets.adapter.rooms.get(roomId);
    channel.members = updatedRoom ? updatedRoom.size : 0;

    io.emit("channels_list", channels);
  });

  socket.on("send_message", ({ roomId, message }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    channel.messages.push(message);
    io.in(roomId).emit("receive_message", message);
  });
  //Typing indicator
  socket.on("typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_typing", { user });
  });

  socket.on("stop_typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_stop_typing", { user });
  });

  socket.on("delete_room", ({ roomId, user }) => {
    const channelIndex = channels.findIndex((c) => c.id === roomId);
    if (channelIndex === -1) {
      socket.emit("room_error", "Room not found!");
      return;
    }

    const channel = channels[channelIndex];

    // Prevent deletion of default system rooms
    const defaultRooms = ["general", "dsa", "web", "aiml", "system", "career"];
    if (defaultRooms.includes(roomId)) {
      socket.emit("room_error", "You cannot delete default rooms!");
      return;
    }

    // Only admin can delete
    if (channel.admin !== user) {
      socket.emit("room_error", "Only the room creator can delete this room!");
      return;
    }

    // Delete the room
    channels.splice(channelIndex, 1);
    io.emit("channels_list", channels);
    io.emit("room_deleted", { roomId });
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomId) => {
      const channel = channels.find((c) => c.id === roomId);
      if (!channel) return;
      const room = io.sockets.adapter.rooms.get(roomId);
      channel.members = room ? room.size - 1 : 0;
    });
    io.emit("channels_list", channels);
  });
});

// ---------------- Routes ----------------
connectDB();
app.use("/api", AIRouter);
app.use("/api/material", pdfRouter);
app.use("/api/user", userRouter);
app.use("/api/yt", ytRouter);

app.get("/", (req, res) =>
  res.send("🚀 Server is running and ready for connections!")
);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
