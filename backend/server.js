
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

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const __dirname = path.resolve();

// HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// --- In-memory channels ---
let channels = [
  {
    id: "general",
    name: "General",
    members: 0,
    unread: 0,
    messages: [{ id: 1, user: "System", text: "Welcome to General channel!" }],
  },
  {
    id: "dsa",
    name: "DSA Group",
    members: 0,
    unread: 0,
    messages: [{ id: 1, user: "System", text: "Discuss DSA problems here." }],
  },
  {
    id: "web",
    name: "Web Dev",
    members: 0,
    unread: 0,
    messages: [{ id: 1, user: "System", text: "Talk about web development." }],
  },
  {
    id: "aiml",
    name: "AI/ML",
    members: 0,
    unread: 0,
    messages: [{ id: 1, user: "System", text: "Share AI/ML resources." }],
  },
  {
    id: "system",
    name: "System Design",
    members: 0,
    unread: 0,
    messages: [
      { id: 1, user: "System", text: "Discuss system design concepts." },
    ],
  },
  {
    id: "career",
    name: "Career Advice",
    members: 0,
    unread: 0,
    messages: [
      { id: 1, user: "System", text: "Talk about career & interview tips." },
    ],
  },
];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // console.log(socket);

  socket.emit("channels_list", channels);

  socket.on("join_room", ({ roomId, user }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    socket.join(roomId);
    socket.data.user = user;

    const room = io.sockets.adapter.rooms.get(roomId);
    channel.members = room ? room.size : 0;

    // Send chat history to this user
    socket.emit("receive_history", channel.messages);

    // Update everyone with new channel data
    io.emit("channels_list", channels);

    //console.log(`${socket.id} joined ${roomId} (members: ${channel.members})`);
  });

  // --- Leave Room ---
  socket.on("leave_room", (roomId) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    socket.leave(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    channel.members = room ? room.size : 0;

    io.emit("channels_list", channels);

    // console.log(`${socket.id} left ${roomId} (members: ${channel.members})`);
  });

  // --- Send Message ---
  socket.on("send_message", ({ roomId, message }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    if (!channel.messages) channel.messages = [];
    channel.messages.push(message);

    // Emit to others in room
    socket.to(roomId).emit("receive_message", message);

    // console.log(`Message in ${roomId} from ${message.user}: ${message.text}`);
  });

  // --- Disconnect Cleanup ---
  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomId) => {
      const channel = channels.find((c) => c.id === roomId);
      if (channel) {
        const room = io.sockets.adapter.rooms.get(roomId);
        channel.members = room ? room.size - 1 : 0;
      }
    });

    io.emit("channels_list", channels);
    //console.log("User disconnected:", socket.id);
  });
});

//Connect DB
connectDB();

app.use("/api", AIRouter);
app.use("/api/material", pdfRouter);
app.use("/api/user", userRouter);
app.use("/api/yt", ytRouter);

app.get("/", (req, res) => {
  res.send("🚀 Server is running and ready for connections!");
});

app.use(express.static(path.join(__dirname, "dist")));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));
