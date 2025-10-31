import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Code,
  BookOpen,
  Lightbulb,
  Sparkles,
  Send,
  TerminalSquare,
  Palette,
  Check,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import { useAIThemeStore } from "../../store/AIStore/useAiThemeStore";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, type: "spring" },
  }),
};

const promptsList = [
  {
    icon: <Code size={26} className="text-blue-400" />,
    prompt: "Explain Binary Search",
    title: "Algorithms",
  },
  {
    icon: <BookOpen size={26} className="text-teal-400" />,
    prompt: "React vs Vue comparison",
    title: "Web Dev",
  },
  {
    icon: <Lightbulb size={26} className="text-yellow-400" />,
    prompt: "Career advice for CS students",
    title: "Career",
  },
  {
    icon: <Sparkles size={26} className="text-blue-300" />,
    prompt: "Study plan for interviews",
    title: "Planning",
  },
];

const themes = {
  "vs-dark": {
    bg: "bg-[#1E1E1E]",
    chatBg: "bg-[#252526]/90",
    msgBot: "bg-[#252526]/95 border border-[#3C3C3C]",
    msgUser: "bg-gradient-to-r from-blue-600 to-indigo-500",
    border: "border-[#3C3C3C]",
    accent: "from-blue-600 to-indigo-700",
  },
  "vs-light": {
    bg: "bg-[#1b1f27]",
    chatBg: "bg-[#232833]",
    msgBot: "bg-[#2c3340] border border-[#3a4252]",
    msgUser: "bg-gradient-to-r from-blue-600 to-blue-400",
    border: "border-[#3a4252]",
    accent: "from-blue-600 to-blue-400",
  },
  "vs-high-contrast": {
    bg: "bg-[#000000]",
    chatBg: "bg-[#111111]",
    msgBot: "bg-[#111111] border border-white/70",
    msgUser: "bg-gradient-to-r from-yellow-500 to-orange-500",
    border: "border-white/70",
    accent: "from-yellow-500 to-orange-500",
  },
  "vs-dark-contrast": {
    bg: "bg-[#0A0A0A]",
    chatBg: "bg-[#121212]",
    msgBot: "bg-[#121212] border border-white/40 shadow-[0_0_10px_#00ffff80]",
    msgUser:
      "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_#00ffff80]",
    border: "border-white/30",
    accent: "from-cyan-500 to-blue-500",
  },
};

const TypingDots = () => (
  <div className="flex gap-1 ml-3 mt-2">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ y: ["0%", "-40%", "0%"] }}
        transition={{ repeat: Infinity, delay: i * 0.2, duration: 0.6 }}
      />
    ))}
  </div>
);

const AI = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hey! I’m your AI Assistant. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, setTheme } = useAIThemeStore();
  const [openDrop, setOpenDrop] = useState(false);
  const t = themes[theme] || themes["vs-dark"];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setStarted(true);
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/ai-chat", { prompt: input });
      if (data.success) toast.success("AI replied!");
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Something went wrong";
      toast.error(msg);
      setMessages((prev) => [...prev, { sender: "bot", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const CodeBlock = ({ code, lang = "text" }) => {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 1500);
      } catch {
        toast.error("Failed to copy!");
      }
    };
    return (
      <div className="relative group rounded-xl overflow-hidden my-3">
        <div
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 bg-[#2c2c2c]/80 text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[#3a3a3a] cursor-pointer"
        >
          {copied ? (
            <CheckCircle2 size={16} className="text-green-400" />
          ) : (
            <Copy size={16} />
          )}
        </div>
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "#1E1E1E",
            borderRadius: "0.5rem",
            overflowX: "auto",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <section
      id="ai"
      className={`relative min-h-[90vh] ${t.bg} text-white flex flex-col font-[Inter]`}
    >
      <div
        className={`border-b ${t.border} px-6 py-4 flex items-center justify-between ${t.chatBg} backdrop-blur-md`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${t.accent} rounded-lg`}>
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              AI Assistant{" "}
              <TerminalSquare size={16} className="text-gray-400" />
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              Powered by intelligent insights <Sparkles className="w-3 h-3" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <span className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gemini-Flash-lite-2.5
          </span>
          <div
            onClick={() => setOpenDrop(!openDrop)}
            className="relative p-2 rounded-lg hover:bg-white/10 transition cursor-pointer "
          >
            <Palette size={18} className="text-gray-300 sticky top-10" />
            {openDrop && (
              <div className="absolute right-0 top-10 w-52 bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                {Object.keys(themes).map((k) => (
                  <div
                    key={k}
                    onClick={() => {
                      setTheme(k);
                      setOpenDrop(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                      theme === k ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    {k.replaceAll("-", " ")}
                    {theme === k && <Check size={16} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar ${t.bg}`}
      >
        {!started && (
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10 place-items-center"
          >
            {promptsList.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px #2563eb80" }}
                onClick={() => {
                  setInput(item.prompt);
                  setStarted(true);
                  inputRef.current.focus();
                }}
                className={`cursor-pointer ${t.msgBot} rounded-2xl ${t.chatBg} p-6 w-60 hover:border-blue-500/70 transition-all`}
              >
                <div className="mb-3">{item.icon}</div>
                <p className="text-gray-100 text-sm font-medium mb-1">
                  {item.prompt}
                </p>
                <p className="text-xs text-gray-500">{item.title}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {started &&
          messages.map((msg, i) => (
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
                className={`px-4 py-3 rounded-2xl text-sm max-w-[95%] md:max-w-[70%] shadow-md ${
                  msg.sender === "user"
                    ? `${t.msgUser} text-white rounded-br-none`
                    : `${t.msgBot} text-gray-200 rounded-bl-none`
                }`}
              >
                {msg.sender === "bot" ? (
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children }) {
                        if (inline) {
                          return (
                            <code className="bg-[#333333] px-1 rounded text-blue-400">
                              {children}
                            </code>
                          );
                        }
                        const lang =
                          className?.replace("language-", "") || "text";
                        return (
                          <CodeBlock
                            code={String(children).replace(/\n$/, "")}
                            lang={lang}
                          />
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
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-[#252526] text-gray-500/70 border border-[#3C3C3C]">
              Thinking <TypingDots />
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      <div
        className={`sticky bottom-0 left-0 w-full border-t ${t.border} ${t.chatBg} p-4 flex items-center`}
      >
        <textarea
          placeholder="Type your message..."
          value={input}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          className={`flex-1 px-4 py-2 h-[50px] bg-[#1E1E1E]/90 text-gray-100 custom-scrollbar rounded-lg border ${t.border} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none resize-none shadow-inner`}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-3 p-2 bg-gradient-to-r ${
            t.accent
          } rounded-lg text-white transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-[0_0_12px_#2563eb80]"
          }`}
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </section>
  );
};

export default AI;
