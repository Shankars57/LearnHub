import {
  BookOpen,
  MessageCircle,
  Puzzle,
  Target,
  TrendingUp,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Target,
    title: "AI Mentor",
    description:
      "Personalized guidance for every learner. Get instant help, code reviews, and smart suggestions tailored to your learning pace.",
    gradient: "from-blue-500 to-cyan-500",
    path: "/ai",
  },
  {
    icon: MessageCircle,
    title: "Group Chat Rooms",
    description:
      "Learn together and solve problems as a community. Join study rooms, collaborate on projects, and grow with peers.",
    gradient: "from-purple-500 to-pink-500",
    path: "/chats",
  },
  {
    icon: Youtube,
    title: "YouTube Playlist Integration",
    description:
      "Curated video lessons for each topic. Access hand-picked tutorials from the best creators, organized by skill level.",
    gradient: "from-red-500 to-orange-500",
    path: "/playlist",
  },
  {
    icon: BookOpen,
    title: "Learning Materials",
    description:
      "Access structured notes, PDFs, and curated resources for every topic. Study anytime, anywhere with organized materials.",
    gradient: "from-yellow-500 to-amber-500",
    path: "/materials",
  },
  {
    icon: Puzzle,
    title: "Project-Based Learning",
    description:
      "Build real-world apps while learning concepts. Apply your knowledge immediately with guided projects and challenges.",
    gradient: "from-green-500 to-emerald-500",
    path: "/roadmaps",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Smart dashboard to track learning goals. Visualize your growth, set milestones, and celebrate achievements.",
    gradient: "from-indigo-500 to-purple-500",
    path: "/profile",
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(165deg, var(--page-bg), var(--page-alt-bg))",
      }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="w-[80%] mx-auto flex flex-col gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold theme-text mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {" "}
              Succeed
            </span>
          </h2>
          <p className="text-xl theme-muted max-w-2xl mx-auto">
            A complete learning ecosystem designed for modern developers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
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
                  backgroundImage: "linear-gradient(to right, var(--tw-gradient-stops))",
                }}
              ></div>

              <div className="relative h-full theme-card backdrop-blur-xl rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold theme-text mb-3">{feature.title}</h3>
                <p className="theme-muted leading-relaxed">{feature.description}</p>

                <button
                  type="button"
                  onClick={() => navigate(feature.path)}
                  className="mt-6 cursor-pointer flex items-center hover:gap-2 text-sm font-semibold"
                >
                  <span
                    className={`bg-gradient-to-r ${feature.gradient} text-transparent bg-clip-text`}
                  >
                    Learn more {"->"}
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
