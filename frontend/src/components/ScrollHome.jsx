import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const scrollLinks = [
  { label: "Home", path: "hero" },
  { label: "Features", path: "features" },
  { label: "Playlists", path: "playlists" },
  { label: "Materials", path: "materials" },
  { label: "Community", path: "community" },
  { label: "AI Mentor", path: "ai" },
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
    <div className="hidden md:flex flex-col fixed top-20 right-0 z-50 items-end">
      <motion.button
        onClick={() => setOpen(!open)}
        className="mb-3 p-2 bg-gray-800/70 rounded-l-md text-white hover:bg-gray-700 transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: open ? 0 : 180 }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <ChevronRight size={20} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col space-y-3 bg-gray-800/70 p-3 rounded-l-md"
          >
            {scrollLinks.map((item, idx) => (
              <a
                key={idx}
                href={`#${item.path}`}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                  active === item.path
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollHome;
