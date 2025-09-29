import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [total, setTotal] = useState(0);
  const socketRef = useRef(null);
  useEffect(() => {
    // Initialize socket only once
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.BACKEND_URL || "http://localhost:5000"
      );
    }
    const socket = socketRef.current;

    // --- Join the new room ---
    socket.emit("join_room", roomId);
    toast.success(`You joined #${roomId}`);

    // --- Update total members for this room ---
    const handleChannelsList = (channels) => {
      const currentRoom = channels.find((c) => c.id === roomId);
      if (currentRoom) setTotal(currentRoom.members);
    };
    socket.on("channels_list", handleChannelsList);

    // --- Receive chat history for this room ---
    const handleHistory = (history) => {
      setMessages(history || []);
      toast(`Loaded ${history?.length || 0} messages in #${roomId}`);
    };
    socket.on("receive_history", handleHistory);

    // --- Receive new messages for this room ---
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      toast.success(`New message from ${msg.user}`);
    };
    socket.on("receive_message", handleMessage);

    // --- Cleanup previous room on room change or unmount ---
    return () => {
      socket.emit("leave_room", roomId); // leave old room
      socket.off("channels_list", handleChannelsList);
      socket.off("receive_history", handleHistory);
      socket.off("receive_message", handleMessage);
      setMessages([]);
      toast(`Left #${roomId}`);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      user: username || "Anonymous",
      text: input,
    };

    // Emit message to server
    socketRef.current.emit("send_message", { roomId, message: newMsg });

    // Show instantly
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/90 text-white flex items-center justify-between">
        <h2 className="font-semibold text-lg capitalize">#{roomId}</h2>
        <h2 className="font-semibold text-lg text-green-400">
          Online: {total}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center italic">
            No messages yet in #{roomId}.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`px-3 py-2 rounded-lg w-fit max-w-xl ${
                msg.user === username
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-700/60 text-gray-200"
              }`}
            >
              <p className="text-xs font-semibold mb-1">{msg.user}</p>
              <ReactMarkdown
                children={msg.text}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-black/40 px-1 py-0.5 rounded text-pink-300">
                        {children}
                      </code>
                    );
                  },
                }}
              />
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${roomId}`}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/60 text-white outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
