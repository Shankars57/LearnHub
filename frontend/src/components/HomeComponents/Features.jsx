import {
  Target,
  MessageCircle,
  Youtube,
  Puzzle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import Snowfall from "react-snowfall";
import { motion } from "framer-motion";

const features = [
  {
    icon: Target,
    title: "AI Mentor",
    description:
      "Personalized guidance for every learner. Get instant help, code reviews, and smart suggestions tailored to your learning pace.",
    gradient: "from-blue-500 to-cyan-500",
  },

  {
    icon: MessageCircle,
    title: "Group Chat Rooms",
    description:
      "Learn together and solve problems as a community. Join study rooms, collaborate on projects, and grow with peers.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Youtube,
    title: "YouTube Playlist Integration",
    description:
      "Curated video lessons for each topic. Access hand-picked tutorials from the best creators, organized by skill level.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: BookOpen, 
    title: "Learning Materials",
    description:
      "Access structured notes, PDFs, and curated resources for every topic. Study anytime, anywhere with organized materials.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Puzzle,
    title: "Project-Based Learning",
    description:
      "Build real-world apps while learning concepts. Apply your knowledge immediately with guided projects and challenges.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Smart dashboard to track learning goals. Visualize your growth, set milestones, and celebrate achievements.",
    gradient: "from-indigo-500 to-purple-500",
  },
];
const Features = () => {
  return (
    <section id="features" className="relative py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 overflow-hidden">
     { /*<Snowfall />*/}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="w-[80%] mx-auto flex flex-col gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {" "}
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A complete learning ecosystem designed for modern developers
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              ></div>

              <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-6 cursor-pointer  flex items-center hover:gap-2 text-sm font-semibold">
                  <span
                    className={`bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}
                  >
                    Learn more →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
