import { motion } from "framer-motion";
import { Heart, MessageSquare, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const chatRooms = [
  {
    name: "JavaScript Ninjas",
    members: 1234,
    active: 89,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "React Developers",
    members: 2341,
    active: 156,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "DSA Masters",
    members: 3456,
    active: 234,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Full Stack Builders",
    members: 1876,
    active: 123,
    color: "from-green-500 to-emerald-500",
  },
];

const highlights = [
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    desc: "Chat, code, and learn together in live study sessions.",
    chip: "bg-blue-500/15 text-blue-500",
  },
  {
    icon: Zap,
    title: "Instant Help",
    desc: "Get your questions answered by peers and mentors quickly.",
    chip: "bg-violet-500/15 text-violet-500",
  },
  {
    icon: Heart,
    title: "Supportive Community",
    desc: "Learn in a positive, encouraging environment.",
    chip: "bg-pink-500/15 text-pink-500",
  },
];

export default function Community() {
  const navigate = useNavigate();
  return (
    <section
      id="community"
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, var(--page-bg), var(--page-alt-bg))",
      }}
    >
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-0 w-80 h-80 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(var(--accent-rgb),0.2)" }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(var(--accent-secondary-rgb),0.18)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold theme-text mb-6">
              Learn Together,
              <br />
              <span className="text-animate">Grow Faster</span>
            </h2>
            <p className="text-xl theme-muted mb-8">
              Join thousands of learners in collaborative study rooms. Share
              knowledge, solve problems together, and build lasting connections
              with fellow developers.
            </p>

            <div className="space-y-6 mb-8">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${item.chip}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold theme-text mb-1">
                        {item.title}
                      </h3>
                      <p className="theme-muted">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/chats")}
              className="theme-btn px-8 py-4 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Join the Community
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {chatRooms.map((room, index) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/chats")}
                className="theme-card rounded-xl p-6 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${room.color} rounded-lg flex items-center justify-center`}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold theme-text">{room.name}</h3>
                      <p className="text-sm theme-muted">
                        {room.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-green-600 font-semibold">
                      {room.active} online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, indexAvatar) => (
                      <div
                        key={indexAvatar}
                        className="w-8 h-8 rounded-full border-2 border-[var(--border-color)]"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(var(--accent-rgb),0.38), rgba(var(--accent-secondary-rgb),0.28))",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm theme-muted ml-2">
                    + many more learning now
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
