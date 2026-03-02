import {
  BookOpen,
  ChevronDown,
  Lightbulb,
  MoveRight,
  Play,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (index = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.2, duration: 0.8, ease: "easeOut" },
  }),
};

const pills = [
  { icon: Sparkles, text: "AI-Powered", tint: "bg-blue-500/15 text-blue-500" },
  { icon: Users, text: "Collaborative", tint: "bg-violet-500/15 text-violet-500" },
  { icon: BookOpen, text: "Comprehensive", tint: "bg-cyan-500/15 text-cyan-500" },
  { icon: Lightbulb, text: "Smart Learning", tint: "bg-amber-500/15 text-amber-500" },
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative w-full flex items-center justify-center py-24 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, var(--page-bg), var(--page-alt-bg))",
      }}
    >
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-[35rem] h-[35rem] rounded-full blur-[160px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(var(--accent-rgb),0.28), rgba(var(--accent-secondary-rgb),0.18))",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-[160px]"
        style={{ backgroundColor: "rgba(var(--accent-secondary-rgb),0.2)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-center"
        >
          <span className="text-animate">
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
                "Start your journey!",
                1500,
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

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6 text-base sm:text-lg md:text-2xl theme-muted max-w-3xl mx-auto leading-relaxed"
        >
          Experience the next generation of collaborative learning. Watch curated
          playlists, chat with peers, explore AI-driven insights, and unlock your
          potential.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 flex flex-wrap gap-4 sm:gap-6 justify-center"
        >
          {pills.map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.div
                key={pill.text}
                whileHover={{ scale: 1.06 }}
                className="theme-chip flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300"
              >
                <span className={`p-1 rounded-full ${pill.tint}`}>
                  <Icon size={16} />
                </span>
                <span className="font-medium text-sm sm:text-base theme-text">
                  {pill.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <motion.a
            href="#playlists"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="theme-btn flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base gap-2 shadow-lg"
          >
            Start Learning
            <MoveRight size={18} />
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="theme-btn-secondary flex items-center justify-center px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-sm sm:text-base gap-2"
          >
            Watch Demo
            <Play size={18} />
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-10 theme-muted flex"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
