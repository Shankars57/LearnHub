import { motion } from "framer-motion";
import { Users, MessageSquare, Zap, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
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

export default function Community() {
  const navigate = useNavigate();
  return (
    <section id="community" className="relative py-24 bg-gradient-to-br from-[#02010a] via-[#050019] to-[#0b001f] overflow-hidden">
       <Snowfall />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-800 rounded-full filter blur-[120px] opacity-25"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-800 rounded-full filter blur-[120px] opacity-25"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Learn Together,
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Grow Faster
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of learners in collaborative study rooms. Share
              knowledge, solve problems together, and build lasting connections
              with fellow developers.
            </p>

           
            <div className="space-y-6 mb-8">
              {[
                {
                  icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
                  title: "Real-time Collaboration",
                  desc: "Chat, code, and learn together in real-time study sessions",
                  bg: "bg-blue-600/20",
                },
                {
                  icon: <Zap className="w-6 h-6 text-purple-400" />,
                  title: "Instant Help",
                  desc: "Get your questions answered by peers and mentors instantly",
                  bg: "bg-purple-600/20",
                },
                {
                  icon: <Heart className="w-6 h-6 text-pink-400" />,
                  title: "Supportive Community",
                  desc: "Learn in a positive, encouraging environment",
                  bg: "bg-pink-600/20",
                },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-3 ${f.bg} rounded-lg`}>{f.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {f.title}
                    </h3>
                    <p className="text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={()=>navigate("/chats")} className="px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-700/40">
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
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${room.color} rounded-lg flex items-center justify-center`}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {room.members.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-semibold">
                      {room.active} online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-2 border-gray-950"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-2">
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
