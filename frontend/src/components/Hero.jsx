import {
  BookOpen,
  MoveRight,
  Play,
  Sparkles,
  Users,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" },
  }),
};

const Hero = () => {
  const pills = [
    {
      icon: <Sparkles size={20} />,
      text: "AI-Powered",
      gradient: "from-[#0a192f] to-[#112240]",
    },
    {
      icon: <Users size={20} />,
      text: "Collaborative",
      gradient: "from-[#1a1a40] to-[#2b2b66]",
    },
    {
      icon: <BookOpen size={20} />,
      text: "Comprehensive",
      gradient: "from-[#003049] to-[#1d3557]",
    },
    {
      icon: <Lightbulb size={20} />,
      text: "Smart Learning",
      gradient: "from-[#0f172a] to-[#1e293b]",
    },
  ];

  return (
    <section id="hero" className="relative w-full flex items-center justify-center py-24 bg-gradient-to-tr from-[#030712] via-[#06071b] to-black overflow-hidden">
     
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[35rem] h-[35rem] bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-800 opacity-25 blur-[160px] rounded-full"
      />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-900/20 blur-[160px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
      
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-center"
        >
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            <TypeAnimation
              sequence={[
                "Learn Together",
                1500,
                "Grow Smarter",
                1500,
                "Achieve More",
                1500,
                "Inspire Others",
                1500,
                "Happy Learning!",
                1500
              ]}
              wrapper="span"
              speed={60}
              repeat={Infinity}
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6 text-base sm:text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Experience the next generation of collaborative learning. Watch
          curated playlists, chat with peers, explore AI-driven insights, and
          unlock your potential.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 flex flex-wrap gap-4 sm:gap-6 justify-center"
        >
          {pills.map((pill, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.1,
                boxShadow: `0 0 25px rgba(100,150,255,0.3)`,
              }}
              className={`flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r ${pill.gradient} text-white shadow-md border border-white/10 backdrop-blur-md transition-all duration-300`}
            >
              {pill.icon}
              <span className="font-medium text-sm sm:text-base">
                {pill.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 35px rgba(0,0,255,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base text-white gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-indigo-900/40"
          >
            <a href="#playlists">Start Learning</a>
            <MoveRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(255,255,255,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base text-white gap-2 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
          >
            Watch Demo
            <Play size={18} />
          </motion.button>
        </motion.div>

        {/* Animated Down Arrow */}
        <motion.div
          className="mt-10 text-white flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={22} />
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 w-full flex justify-center"
        >
          <div className="relative w-full max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-25"></div>
            <div className="relative bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-gray-400 text-sm">
                    LearnHub Dashboard
                  </div>
                </div>
                <div className="h-80 sm:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-gray-500 text-base sm:text-lg">
                    Dashboard Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
