import React, { useEffect, useState, useRef, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import moment from "moment";
import { MoreVertical, Pin, PinOff } from "lucide-react";

const YouTubeEmbed = memo(({ href, children }) => {
  const navigate = useNavigate();
  const videoId = href.split("youtu.be/")[1] || href.split("v=")[1];
  const handleNavigate = () => navigate(`/playlist`);
  return (
    <div className="flex flex-col gap-1">
      <iframe
        width="300"
        height="169"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video"
      />
      <div className="flex items-center gap-2">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/10 block hover:text-white text-xs"
        >
          Youtube
        </a>
        <button
          onClick={handleNavigate}
          className="text-blue-300 px-2 py-1 rounded-lg bg-black/10 block hover:text-white text-xs"
        >
          on-site
        </button>
      </div>
    </div>
  );
});

const TypingIndicator = ({ users }) => (
  <div className="flex items-center gap-1 text-sm text-gray-400 italic">
    <span>
      {users.join(", ")} {users.length > 1 ? "are" : "is"} typing
    </span>
    <span className="typing-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
    <style jsx>{`
      .typing-dots span {
        animation: blink 1.4s infinite both;
        display: inline-block;
      }
      .typing-dots span:nth-child(1) {
        animation-delay: 0s;
      }
      .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes blink {
        0%,
        80%,
        100% {
          opacity: 0;
        }
        40% {
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

const MessageItem = memo(({ msg, username }) => {
  const [stickMessage, setStickMessage] = useState(false);

  return (
    <div
      className={` ${
        stickMessage && "sticky -top-12 overflow-x-hidden z-10"
      } px-3 py-2 rounded-lg w-fit max-w-[90%] sm:max-w-xl break-words ${
        msg.user === username
          ? "ml-auto bg-blue-500 text-white"
          : "bg-gray-700/60 text-gray-200"
      }`}
    >
      <div className={` flex items-center justify-between`}>
        <p
          className="text-xs flex gap-5
    justify-between font-semibold mb-1 opacity-80 px-2 py-1 rounded-lg bg-black/10 inline-block"
        >
          <span>{msg.user}</span>
          <span className="pl-2">
            {moment(msg.time).isSame(new Date(), "day")
              ? moment(msg.time).format("hh:mm A")
              : moment(msg.time).format("MMM D, hh:mm A")}
          </span>
        </p>
        <div className="relative group ">
          <MoreVertical size={14} />
          <button
            onClick={() => setStickMessage(!stickMessage)}
            className="absolute px-2 py-1 bg-black/10   top-3 hidden group-hover:inline-block flex items-center"
          >
            {!stickMessage ? <Pin size={15} /> : <PinOff size={15} />}
          </button>
        </div>
      </div>
      <ReactMarkdown
        children={msg.text}
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <div className="mb-1 flex">{children}</div>,
          a: ({ href, children }) =>
            href.includes("youtu") ? (
              <YouTubeEmbed href={href}>{children}</YouTubeEmbed>
            ) : (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline"
              >
                {children}
              </a>
            ),
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
  );
});

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
      <div className="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold">Join #{roomId}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full max-w-xs text-white outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter room code (if any)"
          className="px-4 py-2 rounded-lg bg-gray-700 w-full max-w-xs text-white outline-none"
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
      <div className="p-2 border-b border-gray-700 bg-gray-800/90 text-white flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold text-lg capitalize">#{roomId}</h2>
        <h2 className="font-semibold text-sm sm:text-base text-green-400">
          Online: {total}
        </h2>
      </div>
      <div className="relative flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-gray-900/90">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-10">
            No messages yet in #{roomId}.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <MessageItem key={msg.id + idx} msg={msg} username={username} />
          ))
        )}
        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        <div ref={bottomRef} />
      </div>
      <div className="p-2 border-t border-gray-700 flex gap-2 bg-gray-800/80">
        <input
          value={input}
          onChange={handleTyping}
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
