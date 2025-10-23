import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Bot, Code, Lightbulb, Sparkles, Send } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      type: "spring",
      stiffness: 120,
    },
  }),
};

const promptsList = [
  {
    icon: <Code size={28} />,
    prompt: "Explain Binary Search",
    title: "Algorithms",
  },
  {
    icon: <BookOpen size={28} />,
    prompt: "React vs Vue comparison",
    title: "Web Dev",
  },
  {
    icon: <Lightbulb size={28} />,
    prompt: "Career advice for CS students",
    title: "Career",
  },
  {
    icon: <Sparkles size={28} />,
    prompt: "Study plan for interviews",
    title: "Planning",
  },
];

const TypingDots = () => (
  <div className="flex gap-1">
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
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setStarted(true);

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/ai-chat", {
        prompt: input,
      });
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

  return (
    <section
      id="ai"
      className="relative pt-4 
     
       bg-gradient-to-br 
       from-gray-950/40 via-blue-950/50 to-purple-950/60
      "
    >
      <div
        className="relative min-h-screen 

    flex flex-col
     bg-gradient-to-b from-black/10 via-gray-900 to-black/10  backdrop-blur-sm
      md:w-[80%] mx-auto 
     "
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center flex 
          flex-col px-2 py-2
          justify-start
         border-b border-white/10"
        >
          <h1
            className="text-3xl
         font-bold 
         bg-gradient-to-r 
         from-blue-900
         to-white bg-clip-text
          text-transparent
           flex 
          sm:text-center
          md:text-start
          sm:justify-center
          md:justify-start items-center gap-2"
          >
            <Sparkles size={22} className="text-white" /> AI Assistant
          </h1>
          <p
            className="text-gray-400 mt-2
          max-sm:text-center
          md:text-start
          text-sm"
          >
            Ask coding, DSA, or career questions instantly.
          </p>
        </motion.div>

        <div
          className="flex-1 
        overflow-y-auto p-6 space-y-4
        custom-scrollbar"
        >
          {!started && (
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex flex-wrap  justify-center gap-6 mt-10"
            >
              {promptsList.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  onClick={() => {
                    setInput(item.prompt);
                    setStarted(true);
                    inputRef.current.focus();
                  }}
                  className="cursor-pointer border border-gray-700 rounded-2xl bg-white/10 backdrop-blur-md p-6 w-52 text-center hover:shadow-lg hover:shadow-pink-500/40 hover:scale-105 transition-transform"
                >
                  <span className="text-white mb-2 p-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 inline-block">
                    {item.icon}
                  </span>
                  <p className="text-white text-sm font-medium">
                    {item.prompt}
                  </p>
                  <p className="text-xs text-gray-400">{item.title}</p>
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
                  className={`px-4 py-3 
                  rounded-2xl text-sm max-w-[100%] md:max-w-[70%] shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-pink-600 to-indigo-500 text-white rounded-br-none"
                      : "bg-gray-800/90 text-gray-200 rounded-bl-none border border-gray-700"
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
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-gray-800/90 text-gray-200 border border-gray-700">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 left-0 w-full border-t border-white/10 bg-black/50 backdrop-blur-lg p-4 flex items-center rounded-md">
          <textarea
            placeholder="Type your message..."
            value={input}
            ref={inputRef}
            onKeyDown={(e) => {
              const keys = e.key;
              if (keys === "Enter") {
                e.preventDefault();
                handleSend();
                e.target.style.height = "50px";
              }
            }}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${
                e.target.scrollHeight > 100
                  ? e.target.scrollHeight / 20
                  : (e.target.style.height = "50px")
              }px`;
            }}
            className="flex-1 px-4 py-2
            h-[50px] items-center
             bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none
      [&::-webkit-scrollbar]:hidden
    "
          />
          <button
            onClick={handleSend}
            className="ml-3 p-2 bg-gradient-to-r from-pink-600 to-indigo-500 rounded-lg text-white hover:opacity-80 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AI;
