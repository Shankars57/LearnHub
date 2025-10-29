import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import AIRouter from "./routes/aiRoute.js";
import pdfRouter from "./routes/materialRoute.js";
import userRouter from "./routes/userRoutes.js";
import ytRouter from "./routes/youtubeRoute.js";
import {
  createRoom,
  deleteRoom,
  addMessage,
  deleteMessage,
  getChatHistory,
  getChannels,
} from "./controller/channelController.js";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({ origin: [process.env.VITE_FRONTEND_URL, "*"], credentials: true })
);
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.VITE_FRONTEND_URL, "*"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

io.on("connection", async (socket) => {
  try {
    const channels = await getChannels();
    socket.emit("channels_list", channels);
  } catch (err) {
    socket.emit("room_error", err.message);
  }

  socket.data = { user: null, roomId: null };

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

  socket.on("join_room", async ({ roomId, user, password }) => {
    try {
      const channels = await getChannels();
      const channel = channels.find((c) => c._id.toString() === roomId);
      if (!channel) throw new Error("Room not found!");
      if (channel.password && channel.password !== password) {
        socket.emit("room_error", "Incorrect password!");
        return;
      }
      if (!onlineUsers[roomId]) onlineUsers[roomId] = new Map();
      if (onlineUsers[roomId].has(user)) {
        const oldSocketId = onlineUsers[roomId].get(user);
        const oldSocket = io.sockets.sockets.get(oldSocketId);
        if (oldSocket && oldSocket.id !== socket.id) {
          try {
            oldSocket.disconnect(true);
          } catch {}
        }
        onlineUsers[roomId].delete(user);
      }
      socket.join(roomId);
      socket.data.user = user;
      socket.data.roomId = roomId;
      onlineUsers[roomId].set(user, socket.id);
      const messages = await getChatHistory(roomId);
      socket.emit("receive_history", messages);
      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId].keys()));
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("send_message", async ({ roomId, message }) => {
    try {
      const savedMessage = await addMessage({ roomId, message });
      io.to(roomId).emit("receive_message", savedMessage);
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("delete_message", async ({ roomId, messageId, user }) => {
    try {
      const deletedId = await deleteMessage({ roomId, messageId, user });
      io.to(roomId).emit("message_deleted", deletedId);
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_typing", { user });
  });

  socket.on("stop_typing", ({ roomId, user }) => {
    socket.to(roomId).emit("user_stop_typing", { user });
  });

  socket.on("delete_room", async ({ roomId, user }) => {
    try {
      const deletedRoomId = await deleteRoom({ roomId, user });
      if (onlineUsers[deletedRoomId]) delete onlineUsers[deletedRoomId];
      const channels = await getChannels();
      io.emit("channels_list", channels);
      io.emit("room_deleted", { roomId: deletedRoomId });
    } catch (err) {
      socket.emit("room_error", err.message);
    }
  });

  socket.on("leave_room", ({ roomId, user }) => {
    if (!roomId || !user) return;
    socket.leave(roomId);
    if (onlineUsers[roomId]) {
      const mappedId = onlineUsers[roomId].get(user);
      if (mappedId === socket.id) {
        onlineUsers[roomId].delete(user);
      }
      io.to(roomId).emit("room_users", Array.from(onlineUsers[roomId].keys()));
    }
    socket.data = { user: null, roomId: null };
  });

  socket.on("disconnect", () => {
    const { roomId, user } = socket.data;
    if (roomId && user && onlineUsers[roomId]) {
      const mappedId = onlineUsers[roomId].get(user);
      if (mappedId === socket.id) {
        onlineUsers[roomId].delete(user);
        io.to(roomId).emit(
          "room_users",
          Array.from(onlineUsers[roomId].keys())
        );
      }
    }
  });
});

app.use("/api", AIRouter);
app.use("/api/material", pdfRouter);
app.use("/api/user", userRouter);
app.use("/api/yt", ytRouter);

app.get("/", (req, res) =>
  res.send("Server is running and ready for connections.")
);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
