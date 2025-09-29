import React, { useState } from "react";
import { Play, Filter, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Playlists = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "DSA",
    "Web Dev",
    "AI/ML",
    "System Design",
    "Database",
  ];

  const playlists = [
    {
      id: 1,
      title: "Complete Data Structures & Algorithms",
      description:
        "Master DSA from basics to advanced with practical implementations and problem solving.",
      category: "DSA",
      thumbnail:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 156,
      duration: "24h 30m",
      views: "1.2M",
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      description:
        "Complete MERN stack course covering React, Node.js, Express, and MongoDB.",
      category: "Web Dev",
      thumbnail:
        "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 89,
      duration: "18h 45m",
      views: "890K",
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      description:
        "Learn ML algorithms, Python libraries, and build real-world projects.",
      category: "AI/ML",
      thumbnail:
        "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 67,
      duration: "15h 20m",
      views: "654K",
    },
    {
      id: 4,
      title: "System Design Interview Prep",
      description:
        "Master system design concepts and ace your technical interviews.",
      category: "System Design",
      thumbnail:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 45,
      duration: "12h 15m",
      views: "432K",
    },
    {
      id: 5,
      title: "Database Design & SQL Mastery",
      description:
        "Complete guide to database design, SQL queries, and optimization techniques.",
      category: "Database",
      thumbnail:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 73,
      duration: "16h 30m",
      views: "567K",
    },
    {
      id: 6,
      title: "Advanced JavaScript Concepts",
      description:
        "Deep dive into JavaScript closures, promises, async/await, and ES6+ features.",
      category: "Web Dev",
      thumbnail:
        "https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400",
      videos: 54,
      duration: "11h 45m",
      views: "723K",
    },
  ];

  const filteredPlaylists =
    activeFilter === "All"
      ? playlists
      : playlists.filter((playlist) => playlist.category === activeFilter);

  // Motion variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <section id="playlists" className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Learning Playlists
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Curated video playlists to accelerate your learning journey
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeFilter === category
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              }`}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 20px rgba(0,0,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Filter className="w-4 h-4" />
              <span>{category}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Playlists Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              className="group bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 20px 40px rgba(0, 0, 255, 0.2)",
              }}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-blue-500/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {playlist.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{playlist.views}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {playlist.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {playlist.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Play className="w-4 h-4" />
                    <span>{playlist.videos} videos</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{playlist.duration}</span>
                  </div>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 10px 30px rgba(0,0,255,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  <span>Start Learning</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Playlists;
