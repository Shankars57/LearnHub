import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import TypingIndicator from "../components/TypeIndicator";
import MessageItem from "./MessageItem";
import usePinnedMessage from "../../store/usePinnedMessage";
import { Palette } from "lucide-react";
import { useChatRoomTheme } from "../../store/useChatRoomTheme";
import { themes } from "./themes";

const ChatRoomDemo = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [joined, setJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showThemes, setShowThemes] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const inputRef = useRef(null);
  const { user } = useAuthStore();
  const [username, setUsername] = useState("");
  const { pinnedMessages, clearPinnedMessage } = usePinnedMessage();
  const pinnedMessage = pinnedMessages[roomId];
  const [roomName, setRoomName] = useState("");
  const { theme, setTheme, roomNames } = useChatRoomTheme();
  const currentTheme = themes[theme] || themes["vs-dark"];

  useEffect(() => {
    setJoined(false);
    setUsername(user?.userName || "");
    setPassword("");
    setMessages([]);
    setTypingUsers([]);
    setOnlineUsers([]);
    setRoomName("");
  }, [roomId]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
      );
    }
    const socket = socketRef.current;

    const handleChannelsList = (channels) => {
      const current = channels.find((c) => c._id === roomId);
      if (current) {
        setRoomName(current.name);
        setOnlineUsers(current.members || []);
      }
    };

    const handleHistory = (history) => {
      setMessages(history || []);
      toast.success(`Joined #${roomName || roomId}`);
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.user !== username) {
        toast.custom(() => (
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-500">
            <b>{msg.user}</b> sent a message.
          </div>
        ));
      }
    };

    const handleRoomUsers = (users) => setOnlineUsers(users || []);
    const handleError = (msg) => {
      toast.error(msg);
      setJoined(false);
    };

    const handleUserTyping = ({ user }) => {
      if (user !== username) {
        setTypingUsers((prev) =>
          !prev.includes(user) ? [...prev, user] : prev
        );
      }
    };

    const handleUserStopTyping = ({ user }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    };

    socket.on("channels_list", handleChannelsList);
    socket.on("receive_history", handleHistory);
    socket.on("receive_message", handleNewMessage);
    socket.on("room_users", handleRoomUsers);
    socket.on("room_error", handleError);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      if (joined && username)
        socket.emit("leave_room", { roomId, user: username });
      socket.off("channels_list", handleChannelsList);
      socket.off("receive_history", handleHistory);
      socket.off("receive_message", handleNewMessage);
      socket.off("room_users", handleRoomUsers);
      socket.off("room_error", handleError);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [roomId, username, joined, roomName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (!username.trim()) return toast.error("Enter a username");
    const socket = socketRef.current;
    socket.emit("join_room", { roomId, user: username, password });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: username || "Anonymous",
      text: input.trim(),
      time: new Date().toISOString(),
    };
    socketRef.current.emit("send_message", { roomId, message: newMsg });
    setInput("");
    socketRef.current.emit("stop_typing", { roomId, user: username });
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    const socket = socketRef.current;
    socket.emit("typing", { roomId, user: username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId, user: username });
    }, 1000);
  };

  const deleteMessage = (id) => {
    const idStr = String(id);
    setMessages((prev) =>
      prev.filter((msg) => String(msg._id || msg.id) !== idStr)
    );
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("delete_message", { roomId, messageId: id });
    }
  };

  if (!joined) {
    const name = roomNames.find((item) => item.id === roomId);
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold capitalize">
          Join # {name?.name || roomName || roomId}
        </h2>
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
          placeholder="Enter room password (if any)"
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
  }
  return (
    <div className={`flex flex-col h-full w-full ${currentTheme.chatBg}`}>
      <div
        className={`p-2 border-b ${currentTheme.border} flex items-center justify-between flex-wrap gap-2`}
      >
        <h2 className={`font-semibold text-lg capitalize text-white`}>
          #{roomName || roomId}
        </h2>
        <div className="flex items-center gap-3 relative">
          <h2 className="font-semibold text-sm sm:text-base text-green-400">
            Online: {onlineUsers.length}
          </h2>
          <div>
            <Palette
              className="cursor-pointer text-blue-400"
              onClick={() => setShowThemes((p) => !p)}
            />
            {showThemes && (
              <div className="absolute right-0 mt-2 bg-[#1e2533] border border-gray-700 rounded-lg shadow-lg text-sm text-gray-200 z-50">
                {Object.keys(themes).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setShowThemes(false);
                    }}
                    className={`block px-4 py-2 w-full text-left hover:bg-gray-700 ${
                      theme === key ? "text-blue-400 font-semibold" : ""
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {pinnedMessage && (
        <div className="border border-blue-500 text-blue-300 text-sm p-2 px-4 flex justify-between items-center sticky top-0 z-20 bg-[#1b1f27]">
          <span>
            📌 Pinned by <b>{pinnedMessage.user}</b>: {pinnedMessage.text}
          </span>
          <button
            onClick={() => clearPinnedMessage(roomId)}
            className="text-xs text-gray-400 hover:text-red-400"
          >
            Clear
          </button>
        </div>
      )}

      <div
        className={`relative flex-1 p-4 overflow-y-auto space-y-3 overflow-x-hidden ${currentTheme.bg}   custom-scrollbar `}
      >
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-10">
            No messages yet in #{roomName || roomId}.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <MessageItem
              key={msg._id || msg.id || `${idx}-${msg.user}-${msg.time}`}
              msg={msg}
              id={msg._id}
              username={username}
              roomId={roomId}
              onDelete={deleteMessage}
            />
          ))
        )}
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        <div ref={bottomRef} />
      </div>

      <div className={`p-2 border-t ${currentTheme.border} flex gap-2`}>
        <textarea
          ref={inputRef}
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={`Send Message...`}
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 50)}px`;
            handleTyping(e);
          }}
          className={`flex-1 px-4 py-2 h-[50px] bg-[#1E1E1E]/90 custom-scrollbar text-gray-100 rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none resize-none shadow-inner sm:placeholder:text-xs md:placeholder:text-sm placeholder:truncate`}
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

export default ChatRoomDemo;
