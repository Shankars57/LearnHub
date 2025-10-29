import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizonal, BrainCircuit, Activity } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

const AIChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hey there! I'm your AI assistant. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post("api/ai-chat", { prompt: input });
      const botMsg = { sender: "bot", text: data.reply || "⚠️ No response." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = "Error: " + (err.response?.data?.message || err.message);
      setMessages((prev) => [...prev, { sender: "bot", text: errorMsg }]);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[70%] lg:w-[60%] mx-auto mt-10 mb-20 font-[Inter]">
      <div className="flex items-center justify-between bg-[#1e1e1e] border border-[#2d2d2d] rounded-t-2xl px-5 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#007acc] to-[#005fa3]">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-100">
              AI Assistant
            </h2>
            <p className="text-xs text-gray-400">Always ready to chat 💬</p>
          </div>
        </div>
        <div className="text-sm text-emerald-400 flex items-center gap-1">
          <Activity size={14} className="animate-pulse" />
          Online
        </div>
      </div>

      <div className="bg-[#1e1e1e] border-x border-b border-[#2d2d2d] overflow-y-auto h-[550px] p-5 space-y-5 text-white shadow-2xl rounded-b-2xl">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#0e639c] text-white shadow-md"
                    : "bg-[#252526] text-gray-200 border border-[#333333]"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      return !inline ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={className?.replace("language-", "") || ""}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-[#333333] px-1 rounded text-[#569cd6]">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-sm pl-1">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 rounded-full bg-[#007acc]"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-[#007acc]"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-[#007acc]"
            />
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-3 bg-[#1e1e1e] border border-[#2d2d2d] rounded-xl px-3 py-2 shadow-lg">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          className="p-2.5 rounded-lg bg-[#007acc] hover:bg-[#0088ff] transition-all shadow-md"
        >
          <SendHorizonal size={18} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default AIChatBot;
