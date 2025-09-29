import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import AIRouter from "./routes/aiRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Channels with initial messages
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

  // Send current channel list to the client
  socket.emit("channels_list", channels);

  // Join room
  socket.on("join_room", (roomId) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;
    socket.join(roomId);
    // Update members count based on actual room size
    const room = io.sockets.adapter.rooms.get(roomId);
    channel.members = room ? room.size : 0;
    // Send chat history to the user
    socket.emit("receive_history", channel.messages);
    // Notify all clients about updated members count
    io.emit("channels_list", channels);
    console.log(`${socket.id} joined ${roomId} (members: ${channel.members})`);
  });

  // Leave room
  socket.on("leave_room", (roomId) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    socket.leave(roomId);

    const room = io.sockets.adapter.rooms.get(roomId);
    channel.members = room ? room.size : 0;

    io.emit("channels_list", channels);
    console.log(`${socket.id} left ${roomId} (members: ${channel.members})`);
  });

  // Handle messages
  socket.on("send_message", ({ roomId, message }) => {
    const channel = channels.find((c) => c.id === roomId);
    if (!channel) return;

    if (!channel.messages) channel.messages = [];
    channel.messages.push(message);

    // Send to others in the same room
    socket.to(roomId).emit("receive_message", message);
    //console.log(`Message in ${roomId}:`, message.text);
  });
  // Disconnect
  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomId) => {
      const channel = channels.find((c) => c.id === roomId);
      if (channel) {
        const room = io.sockets.adapter.rooms.get(roomId);
        channel.members = room ? room.size : 0;
      }
    });

    io.emit("channels_list", channels);
    console.log("User disconnected:", socket.id);
  });
});

// API routes
app.use("/api", AIRouter);

// Root
app.get("/", (req, res) => {
  res.send("Server is running and ready for connections!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
