import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";
import TypingIndicator from "../TypeIndicator";
import MessageItem from "../MessageItem";
import usePinnedMessage from "../../../store/usePinnedMessage";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [joined, setJoined] = useState(true);
  const [total, setTotal] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuthStore();
  const [username, setUsername] = useState("");
  const { pinnedMessages, clearPinnedMessage } = usePinnedMessage();

  const pinnedMessage = pinnedMessages[roomId];

  useEffect(() => {
    setJoined(false);
    setUsername("");
    setPassword("");
    setMessages([]);
    setTotal(0);
    setTypingUsers([]);
  }, [roomId]);

  useEffect(() => {
    if (user.userName) setUsername(user.userName);
  }, [roomId]);

  useEffect(() => {
    if (!socketRef.current)
      socketRef.current = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
      );
    const socket = socketRef.current;

    const handleChannelsList = (channels) => {
      const current = channels.find((c) => c.id === roomId);
      if (current) setTotal(current.members);
    };

    const handleHistory = (history) => {
      setMessages(history || []);
      toast.success(`Joined #${roomId}`);
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.user !== username)
        toast.custom(() => (
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500">
            <b>{msg.user}</b> sent a message in <b>#{roomId}</b>
          </div>
        ));
    };

    const handleError = (msg) => {
      toast.error(msg);
      setJoined(false);
    };

    const handleUserTyping = ({ user }) => {
      setTypingUsers((prev) =>
        !prev.includes(user) && user !== username ? [...prev, user] : prev
      );
    };

    const handleUserStopTyping = ({ user }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    };

    socket.on("channels_list", handleChannelsList);
    socket.on("receive_history", handleHistory);
    socket.on("receive_message", handleMessage);
    socket.on("room_error", handleError);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      if (joined) socket.emit("leave_room", { roomId, user: username });
      socket.off("channels_list", handleChannelsList);
      socket.off("receive_history", handleHistory);
      socket.off("receive_message", handleMessage);
      socket.off("room_error", handleError);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [roomId, username, joined]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (!username.trim()) return toast.error("Enter a username");
    socketRef.current.emit("join_room", { roomId, user: username, password });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: username || "Anonymous",
      text: input,
      time: new Date().toISOString(),
    };
    socketRef.current.emit("send_message", { roomId, message: newMsg });
    setInput("");
    socketRef.current.emit("stop_typing", { roomId, user: username });
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socketRef.current.emit("typing", { roomId, user: username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("stop_typing", { roomId, user: username });
    }, 1000);
  };

  if (!joined)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold">Join #{roomId}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="px-4 py-2 rounded-lg border w-full max-w-xs outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter room code (if any)"
          className="px-4 py-2 rounded-lg border w-full max-w-xs outline-none"
        />
        <button
          onClick={joinRoom}
          className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white w-full max-w-xs"
        >
          Join Room
        </button>
      </div>
    );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-2 border-b flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-lg capitalize">#{roomId}</h2>
        <h2 className="font-semibold text-sm sm:text-base text-green-600">
          Online: {total}
        </h2>
      </div>

      {pinnedMessage && (
        <div className="border border-green-500 text-green-700 text-sm p-2 px-4 flex justify-between items-center sticky top-0 z-20 bg-white/80">
          <span>
            📌 Pinned by <b>{pinnedMessage.user}</b>: {pinnedMessage.text}
          </span>
          <button
            onClick={() => clearPinnedMessage(roomId)}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            Clear
          </button>
        </div>
      )}

      <div className="relative flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center italic mt-10">
            No messages yet in #{roomId}.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <MessageItem
              key={msg.id + idx}
              msg={msg}
              username={username}
              roomId={roomId}
            />
          ))
        )}
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        <div ref={bottomRef} />
      </div>

      <div className="p-2 border-t flex gap-2">
        <input
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message #${roomId}`}
          className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm sm:text-base"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
