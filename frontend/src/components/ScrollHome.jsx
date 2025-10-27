import React, { useState, useEffect } from "react";
import {
  Book,
  Bot,
  ChevronLeft,
  ChevronRight,
  Feather,
  Home,
  MessageCircle,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const scrollLinks = [
  { label: "Home", path: "hero", icon: <Home size={15} /> },
  { label: "Features", path: "features", icon: <Feather size={15} /> },
  { label: "Playlists", path: "playlists", icon: <Play size={15} /> },
  { label: "Materials", path: "materials", icon: <Book size={15} /> },
  { label: "Community", path: "community", icon: <MessageCircle size={15} /> },
  { label: "AI Mentor", path: "ai", icon: <Bot size={15} /> },
];

const ScrollHome = () => {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      scrollLinks.forEach((link) => {
        const section = document.getElementById(link.path);
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top <= 100 && top >= -100) setActive(link.path);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hidden md:flex flex-col fixed top-40 right-10 z-50 items-end ">
      <motion.button
        onClick={() => setOpen(!open)}
        className="mb-3 p-2 bg-gray-800/70 rounded-md text-white hover:bg-gray-700 transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <ChevronRight size={15} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col space-y-3 bg-gray-800/70 py-4 px-2 rounded-full shadow-md shadow-white/20"
          >
            {scrollLinks.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.path}`}
                className={`px-2 py-1 rounded-md transition-colors duration-200 ${
                  active === item.path
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollHome;
