import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BookOpen,
  Check,
  CheckCircle2,
  Code,
  Copy,
  Lightbulb,
  Loader2,
  Palette,
  Send,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import { useAIThemeStore } from "../../store/AIStore/useAiThemeStore";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.12, duration: 0.5, type: "spring" },
  }),
};

const prompts = [
  {
    icon: <Code size={24} className="text-blue-500" />,
    prompt: "Explain binary search with dry run.",
    title: "Algorithms",
  },
  {
    icon: <BookOpen size={24} className="text-emerald-500" />,
    prompt: "React vs Vue comparison for beginners.",
    title: "Web Dev",
  },
  {
    icon: <Lightbulb size={24} className="text-amber-500" />,
    prompt: "Career roadmap for a CS student.",
    title: "Career",
  },
  {
    icon: <Sparkles size={24} className="text-fuchsia-500" />,
    prompt: "Create a 4-week interview prep schedule.",
    title: "Planning",
  },
];

const themeOptions = {
  "vs-dark": {
    label: "Dark",
    bubble: "from-blue-600 to-cyan-500",
    focusRing: "focus:ring-blue-500",
  },
  "vs-light": {
    label: "Light",
    bubble: "from-indigo-500 to-sky-500",
    focusRing: "focus:ring-indigo-500",
  },
  "ai-theme": {
    label: "Moderate",
    bubble: "from-amber-600 to-teal-600",
    focusRing: "focus:ring-amber-500",
  },
};

const TypingDots = () => (
  <div className="flex gap-1 ml-3 mt-2">
    {[0, 1, 2].map((index) => (
      <motion.span
        key={index}
        className="w-2 h-2 rounded-full bg-[var(--text-secondary)]"
        animate={{ y: ["0%", "-40%", "0%"] }}
        transition={{ repeat: Infinity, delay: index * 0.2, duration: 0.6 }}
      />
    ))}
  </div>
);

const AI = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I am your AI assistant. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [openThemeDropdown, setOpenThemeDropdown] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const { theme, setTheme } = useAIThemeStore();

  const currentTheme = themeOptions[theme] || themeOptions["vs-dark"];
  const syntaxTheme = theme === "vs-dark" ? oneDark : oneLight;

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const codeBlockBackground = useMemo(
    () => (theme === "vs-dark" ? "#111827" : "#f8fafc"),
    [theme]
  );

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setStarted(true);
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/ai-chat", { prompt: input });
      if (data.success) toast.success("AI replied.");
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(msg);
      setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${msg}` }]);
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
        toast.success("Copied to clipboard.");
        setTimeout(() => setCopied(false), 1500);
      } catch {
        toast.error("Failed to copy.");
      }
    };

    return (
      <div className="relative group rounded-xl overflow-hidden my-3 border border-[var(--border-color)]">
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-lg theme-btn-secondary opacity-0 group-hover:opacity-100 transition"
        >
          {copied ? (
            <CheckCircle2 size={16} className="text-green-500" />
          ) : (
            <Copy size={16} className="theme-text" />
          )}
        </button>
        <SyntaxHighlighter
          language={lang}
          style={syntaxTheme}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: codeBlockBackground,
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
    <section id="ai" className="theme-page relative min-h-[90vh] flex flex-col">
      <div className="theme-surface border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${currentTheme.bubble}`}>
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold theme-text flex items-center gap-2">
              AI Assistant
              <TerminalSquare size={16} className="theme-muted" />
            </h1>
            <p className="text-xs theme-muted flex items-center gap-1">
              Powered by intelligent insights
              <Sparkles className="w-3 h-3" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Gemini Flash Lite
          </span>
          <button
            type="button"
            onClick={() => setOpenThemeDropdown((prev) => !prev)}
            className="relative p-2 rounded-lg theme-btn-secondary"
          >
            <Palette size={18} className="theme-text" />
          </button>
          {openThemeDropdown ? (
            <div className="absolute right-0 top-12 w-44 theme-panel rounded-lg shadow-lg z-50 p-1">
              {Object.entries(themeOptions).map(([key, option]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTheme(key);
                    setOpenThemeDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                    theme === key
                      ? "theme-btn text-white"
                      : "theme-btn-secondary theme-text"
                  }`}
                >
                  {option.label}
                  {theme === key ? <Check size={15} /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
        {!started ? (
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-8 place-items-center"
          >
            {prompts.map((item, index) => (
              <motion.button
                type="button"
                key={item.prompt}
                custom={index}
                variants={fadeUp}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  setInput(item.prompt);
                  setStarted(true);
                  inputRef.current?.focus();
                }}
                className="theme-card rounded-2xl p-5 w-60 text-left"
              >
                <div className="mb-3">{item.icon}</div>
                <p className="theme-text text-sm font-medium mb-1">{item.prompt}</p>
                <p className="text-xs theme-muted">{item.title}</p>
              </motion.button>
            ))}
          </motion.div>
        ) : null}

        {started
          ? messages.map((message, index) => (
              <motion.div
                key={`${message.sender}-${index}`}
                initial={{ opacity: 0, x: message.sender === "user" ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-[95%] md:max-w-[70%] shadow-md leading-loose ${
                    message.sender === "user"
                      ? `bg-gradient-to-r ${currentTheme.bubble} text-white rounded-br-none`
                      : "theme-card theme-text rounded-bl-none"
                  }`}
                >
                  {message.sender === "bot" ? (
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children }) {
                          if (inline) {
                            return (
                              <code className="theme-chip px-1 py-0.5 rounded">
                                {children}
                              </code>
                            );
                          }
                          const lang = className?.replace("language-", "") || "text";
                          return (
                            <CodeBlock
                              code={String(children).replace(/\n$/, "")}
                              lang={lang}
                            />
                          );
                        },
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
              </motion.div>
            ))
          : null}

        {loading ? (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl theme-card theme-muted">
              Thinking
              <TypingDots />
            </div>
          </div>
        ) : null}
        <div ref={messageEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full border-t border-[var(--border-color)] theme-surface p-4 flex items-center">
        <textarea
          placeholder="Type your message..."
          value={input}
          ref={inputRef}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          onChange={(event) => {
            setInput(event.target.value);
            event.target.style.height = "auto";
            event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
          }}
          className={`flex-1 px-4 py-2 h-[50px] custom-scrollbar rounded-lg border theme-input focus:outline-none focus:ring-2 resize-none ${currentTheme.focusRing}`}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-3 p-2 rounded-lg text-white transition bg-gradient-to-r ${currentTheme.bubble} ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"
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
