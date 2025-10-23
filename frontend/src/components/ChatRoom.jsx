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
  const [joined, setJoined] = useState(false);
  const [total, setTotal] = useState(0);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
      );
    }
    const socket = socketRef.current;

    const handleChannelsList = (channels) => {
      const current = channels.find((c) => c.id === roomId);
      if (current) setTotal(current.members);
    };

    const handleHistory = (history) => {
      setMessages(history || []);
      toast(`Loaded ${history?.length || 0} messages in #${roomId}`);
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.user !== username) toast.success(`New message from ${msg.user}`);
    };

    socket.on("channels_list", handleChannelsList);
    socket.on("receive_history", handleHistory);
    socket.on("receive_message", handleMessage);

    return () => {
      socket.emit("leave_room", { roomId, user: username });
      socket.off("channels_list", handleChannelsList);
      socket.off("receive_history", handleHistory);
      socket.off("receive_message", handleMessage);
      setMessages([]);
    };
  }, [roomId, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (!username.trim()) {
      toast.error("Enter a username before joining!");
      return;
    }
    socketRef.current.emit("join_room", { roomId, user: username });
    toast.success(`You joined #${roomId} as ${username}`);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: username || "Anonymous",
      text: input,
    };
    socketRef.current.emit("send_message", { roomId, message: newMsg });
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join #{roomId}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && joinRoom()}
          placeholder="Enter your username"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full max-w-xs text-white mb-4 outline-none"
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
    <div className="flex flex-col h-full w-full ">
      <div className="p-4 border-b border-gray-700 bg-gray-800/90 text-white  
       flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-lg capitalize">#{roomId}</h2>
        <h2 className="font-semibold text-sm sm:text-base text-green-400">
          Online: {total}
        </h2>
      </div>

      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-900/90">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-10">
            No messages yet in #{roomId}.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`px-3 py-2 rounded-lg w-fit max-w-[90%] sm:max-w-xl break-words ${
                msg.user === username
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-gray-700/60 text-gray-200"
              }`}
            >
              <p className="text-xs font-semibold mb-1 opacity-80">
                {msg.user}
              </p>
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
                        className="rounded-lg text-sm"
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
        <div ref={bottomRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-700 flex gap-2 bg-gray-800/80">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={`Message #${roomId}`}
          className="flex-1 px-3 py-2 rounded-lg bg-gray-700/60 text-white outline-none text-sm sm:text-base"
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
