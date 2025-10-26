import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

// ====== Animation Variants ======
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const TypingIndicator = () => (
  <div className="flex gap-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-gray-300 rounded-full"
        animate={{ y: ["0%", "-50%", "0%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          delay: i * 0.2,
          duration: 0.6,
        }}
      />
    ))}
  </div>
);

const AIChatBot = () => {
  const [status] = useState("online");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I’m your AI Assistant 🤖. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/ai-chat", {
        prompt: input,
      });
      if (data.success) toast.success("New response received ");
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(errorMessage);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="w-[60%] mx-auto mb-10 flex flex-col 
      border mt-8 border-white/10 rounded-xl bg-white/5 h-[500px] 
      backdrop-blur-lg shadow-lg"
    >
      {/* Header */}
      <div className="min-h-20 px-4 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl gap-2 text-white flex flex-col">
          <span className="flex items-center gap-2">
            <span className="p-1 border border-white/20 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600">
              <Bot size={22} />
            </span>
            AI Assistant
          </span>
          <p className="text-sm text-gray-500">Always here to help you.</p>
        </h1>
        <div className="flex items-center gap-1">
          <span
            className={`w-3 h-3 border rounded-full ${
              status === "online" ? "bg-green-500" : "bg-red-400"
            }`}
          ></span>
          <p
            className={`text-sm ${
              status === "online" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "online" ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden 
        [-ms-overflow-style:none] [scrollbar-width:none] space-y-4"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-pink-600 to-indigo-500 text-white rounded-br-none"
                  : "bg-gray-800/90 text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.sender === "bot" ? (
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      return !inline ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={
                            className?.replace("language-", "") || "text"
                          }
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-700 px-1 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </motion.div>
        ))}

     
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="px-4 py-2 rounded-lg max-w-[70%] bg-gray-800/90 text-gray-200 rounded-bl-none">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={messageEndRef} />
      </div>

     
      <div className="flex items-center p-3 border-t border-white/10">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              await handleSend();
            }
          }}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleSend}
          className="ml-3 p-2 bg-gradient-to-r from-pink-600 to-indigo-500 rounded-lg text-white hover:opacity-80 transition"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default AIChatBot;
