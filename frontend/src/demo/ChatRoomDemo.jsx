import React, { useEffect, useRef, useState } from "react";
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
  const {
    theme,
    setTheme,
    roomNames,
    setCurrentChatRoom,
    currentChatRoom,
  } = useChatRoomTheme();
  const currentTheme = themes[theme] || themes["vs-dark"];

  useEffect(() => {
    setJoined(false);
    setUsername(user?.userName || "");
    setPassword("");
    setMessages([]);
    setTypingUsers([]);
    setOnlineUsers([]);
    setRoomName("");
  }, [roomId, user?.userName]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
      );
    }
    const socket = socketRef.current;

    const handleChannelsList = (channels) => {
      const current = channels.find((channel) => channel._id === roomId);
      if (current) {
        setRoomName(current.name);
        setOnlineUsers(current.members || []);
      }
    };

    const handleHistory = (history) => {
      setMessages(history || []);
      const room = roomNames.find((item) => item.id === roomId);
      setCurrentChatRoom(room?.name);
      toast.success(`Joined #${room?.name || roomName || roomId}`);
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.user !== username) {
        toast.custom(() => (
          <div className="theme-panel theme-text px-4 py-2 rounded-lg shadow-lg border border-blue-500/40">
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

    const handleUserTyping = ({ user: typingUser }) => {
      if (typingUser !== username) {
        setTypingUsers((prev) =>
          !prev.includes(typingUser) ? [...prev, typingUser] : prev
        );
      }
    };

    const handleUserStopTyping = ({ user: typingUser }) => {
      setTypingUsers((prev) => prev.filter((entry) => entry !== typingUser));
    };

    socket.on("channels_list", handleChannelsList);
    socket.on("receive_history", handleHistory);
    socket.on("receive_message", handleNewMessage);
    socket.on("room_users", handleRoomUsers);
    socket.on("room_error", handleError);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      if (joined && username) {
        socket.emit("leave_room", { roomId, user: username });
      }
      socket.off("channels_list", handleChannelsList);
      socket.off("receive_history", handleHistory);
      socket.off("receive_message", handleNewMessage);
      socket.off("room_users", handleRoomUsers);
      socket.off("room_error", handleError);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [roomId, username, joined, roomName, roomNames, setCurrentChatRoom]);

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
    const newMessage = {
      id: Date.now(),
      user: username || "Anonymous",
      text: input.trim(),
      time: new Date().toISOString(),
    };
    socketRef.current.emit("send_message", { roomId, message: newMessage });
    setInput("");
    socketRef.current.emit("stop_typing", { roomId, user: username });
  };

  const handleTyping = (event) => {
    setInput(event.target.value);
    const socket = socketRef.current;
    socket.emit("typing", { roomId, user: username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { roomId, user: username });
    }, 1000);
  };

  const deleteMessage = (id) => {
    const idAsString = String(id);
    setMessages((prev) =>
      prev.filter((message) => String(message._id || message.id) !== idAsString)
    );
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("delete_message", { roomId, messageId: id });
    }
  };

  if (!joined) {
    const room = roomNames.find((item) => item.id === roomId);
    return (
      <div className="theme-page flex flex-col items-center justify-center h-full w-full p-6 text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold capitalize theme-text">
          Join # {room?.name || roomName || roomId}
        </h2>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          className="theme-input px-4 py-2 rounded-lg border w-full max-w-xs outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter room password (if any)"
          className="theme-input px-4 py-2 rounded-lg border w-full max-w-xs outline-none"
        />
        <button
          onClick={joinRoom}
          className={`px-6 py-2 rounded-lg w-full max-w-xs font-semibold ${currentTheme.primaryBtn}`}
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
        <h2 className={`font-semibold text-lg capitalize ${currentTheme.heading}`}>
          #{currentChatRoom || roomName || roomId}
        </h2>

        <div className="flex items-center gap-3 relative">
          <h2 className={`font-semibold text-sm sm:text-base ${currentTheme.accentText}`}>
            Online: {onlineUsers.length}
          </h2>
          <div>
            <Palette
              className={`cursor-pointer ${currentTheme.accentText}`}
              onClick={() => setShowThemes((prev) => !prev)}
            />
            {showThemes && (
              <div
                className={`absolute right-0 mt-2 rounded-lg shadow-lg text-sm z-50 min-w-36 ${currentTheme.panel} border ${currentTheme.border}`}
              >
                {Object.keys(themes).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setShowThemes(false);
                    }}
                    className={`block px-4 py-2 w-full text-left transition ${
                      theme === key
                        ? `${currentTheme.accentText} font-semibold`
                        : `${currentTheme.heading} hover:bg-black/5`
                    }`}
                  >
                    {themes[key].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {pinnedMessage ? (
        <div
          className={`text-sm p-2 px-4 flex justify-between items-center sticky top-0 z-20 border border-blue-500/60 ${currentTheme.panel}`}
        >
          <span className={currentTheme.heading}>
            Pinned by <b>{pinnedMessage.user}</b>: {pinnedMessage.text}
          </span>
          <button
            onClick={() => clearPinnedMessage(roomId)}
            className={`text-xs ${currentTheme.muted} hover:text-red-500`}
          >
            Clear
          </button>
        </div>
      ) : null}

      <div
        className={`relative flex-1 p-4 overflow-y-auto space-y-3 overflow-x-hidden ${currentTheme.boardBg} custom-scrollbar`}
      >
        {messages.length === 0 ? (
          <p className={`${currentTheme.muted} text-center italic mt-10`}>
            No messages yet in #{roomName || roomId}.
          </p>
        ) : (
          messages.map((message, index) => (
            <MessageItem
              key={message._id || message.id || `${index}-${message.user}-${message.time}`}
              msg={message}
              id={message._id}
              username={username}
              roomId={roomId}
              onDelete={deleteMessage}
            />
          ))
        )}
        {typingUsers.length > 0 ? <TypingIndicator users={typingUsers} /> : null}
        <div ref={bottomRef} />
      </div>

      <div className={`p-2 border-t ${currentTheme.border} flex gap-2`}>
        <textarea
          ref={inputRef}
          value={input}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Send message..."
          onChange={(event) => {
            event.target.style.height = "auto";
            event.target.style.height = `${Math.min(event.target.scrollHeight, 50)}px`;
            handleTyping(event);
          }}
          className={`flex-1 px-4 py-2 h-[50px] custom-scrollbar rounded-lg border focus:outline-none resize-none ${currentTheme.input}`}
        />
        <button
          onClick={sendMessage}
          className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold ${currentTheme.primaryBtn}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoomDemo;
