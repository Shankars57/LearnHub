import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";

// Import route handlers
import AIRouter from "./routes/aiRoute.js";
import pdfRouter from "./routes/materialRoute.js";
import userRouter from "./routes/userRoutes.js";
import ytRouter from "./routes/youtubeRoute.js";

// Import channel controller functions
import {
  createRoom,
  deleteRoom,
  addMessage,
  getChatHistory,
  getChannels,
} from "./controller/channelController.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Map to track online users in each room
const onlineUsers = {};

// Socket.IO event handling
io.on("connection", async (socket) => {
 

  // Send the current list of channels to the connected client
  try {
    const channels = await getChannels();
    socket.emit("channels_list", channels);
  } catch (err) {
    socket.emit("room_error", err.message);
  }

  // Store socket-specific data
  socket.data = { user: null, roomId: null };

  // Create a new room
  socket.on("create_room", async ({ name, user, password }) => {
    try {
      const newRoom = await createRoom({ name, user, password });
      const channels = await getChannels();
      io.emit("channels_list", channels);
      socket.emit("room_created", newRoom);
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  // Join an existing room
  socket.on("join_room", async ({ roomId, user, password }) => {
    try {
      const channels = await getChannels();
      const channel = channels.find((c) => c._id.toString() === roomId);
      if (!channel) throw new Error("Room not found!");

      // Check password if protected
      if (channel.password && channel.password !== password) {
        socket.emit("room_error", "Incorrect password!");
        return;
      }

      // Initialize user list for room if not exist
      if (!onlineUsers[roomId]) onlineUsers[roomId] = new Set();

      // Prevent duplicate usernames in the same room
      if (onlineUsers[roomId].has(user)) {
        socket.emit("room_error", "Username already in use in this room!");
        return;
      }

      // Join the room
      socket.join(roomId);
      socket.data.user = user;
      socket.data.roomId = roomId;

      // Add user to tracking map
      onlineUsers[roomId].add(user);

      // Send chat history to the user
      const messages = await getChatHistory(roomId);
      socket.emit("receive_history", messages);

      // Notify all users in the room about updated online list
      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  // Send a new message in a room
  socket.on("send_message", async ({ roomId, message }) => {
    try {
      const savedMessage = await addMessage({ roomId, message });
      io.to(roomId).emit("receive_message", savedMessage);
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  // Typing indicator events
  socket.on("typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_typing", { user });
  });

  socket.on("stop_typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_stop_typing", { user });
  });

  // Delete an existing room
  socket.on("delete_room", async ({ roomId, user }) => {
    try {
      const deletedRoomId = await deleteRoom({ roomId, user });
      const channels = await getChannels();
      io.emit("channels_list", channels);
      io.emit("room_deleted", { roomId: deletedRoomId });
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const { roomId, user } = socket.data;

    if (roomId && user && onlineUsers[roomId]) {
      // Remove user from the room's set
      onlineUsers[roomId].delete(user);

      // Broadcast updated list to the room
      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId]));
    }

    
  });
});

// REST API routes
app.use("/api", AIRouter);
app.use("/api/material", pdfRouter);
app.use("/api/user", userRouter);
app.use("/api/yt", ytRouter);

// Root test route
app.get("/", (req, res) =>
  res.send("Server is running and ready for connections.")
);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
