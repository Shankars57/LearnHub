import {
  BookOpen,
  MoveRight,
  Play,
  Sparkles,
  Users,
  MoveDownIcon,
  MoveDown,
  ChevronDown,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const hoverText = {
  hover: {
    scale: 1.1,
    textShadow: "0px 4px 20px rgba(255,255,255,0.6)",
    transition: { type: "spring", stiffness: 300 },
  },
};

const Hero = () => {
  return (
    <section className="relative w-full flex items-center justify-center py-16 bg-gradient-to-tr from-[#050510] via-[#0a0215] to-black overflow-hidden">
      {/* Background decorative glow */}
      <div className="absolute -top-28 -left-28 w-[28rem] h-[28rem] bg-blue-900/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[22rem] h-[22rem] bg-purple-900/20 blur-[150px] rounded-full"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl 
      mx-auto px-6 text-center flex flex-col items-center">
        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-extrabold leading-tight"
        >
          <motion.span
            className="block bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
            variants={hoverText}
            whileHover="hover"
          >
            Learn Together,
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            variants={hoverText}
            whileHover="hover"
          >
            Grow Smarter
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-8 text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Join the ultimate collaborative learning platform where knowledge
          meets community. Watch curated playlists, share resources, chat with
          peers, and get instant AI assistance.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-12 flex flex-wrap gap-6 justify-center"
        >
          {[
            {
              icon: <Sparkles size={20} />,
              text: "AI-Powered",
              from: "indigo",
              to: "darkblue",
            },
            {
              icon: <Users size={20} />,
              text: "Collaborative",
              from: "purple",
              to: "deepPink",
            },
            {
              icon: <BookOpen size={20} />,
              text: "Comprehensive",
              from: "green",
              to: "darkgreen ",
            },
          ].map((pill, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.08,
                boxShadow: `0px 8px 25px rgba(255,255,255,0.2)`,
              }}
              className={`flex
               items-center gap-2
                px-6 py-3 rounded-full 
                bg-gradient-to-r from-${pill.from} to-${pill.to} 
                text-white shadow-lg
                border
                `}
              style={{
                backgroundImage: `linear-gradient( ${pill.from} , ${pill.to})`,
              }}
            >
              {pill.icon}
              <span className="font-medium">{pill.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(0,0,255,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 py-3 rounded-full text-white gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md shadow-indigo-900/40"
          >
            <a href="#playlists">Start Learning</a>
            <MoveRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(255,255,255,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 py-3 rounded-full text-white gap-2 border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10"
          >
            Watch Demo
            <Play size={18} />
          </motion.button>
        </motion.div>

        {/* Down Icon */}
        <motion.div
          className="mt-5 text-white text-center flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
