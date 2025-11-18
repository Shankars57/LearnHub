import React, { useState } from "react";
import VideoContent from "../components/VideoContent";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, Youtube } from "lucide-react";

const videoContent = {
  dsa: [
    "takeUforward",
    "Apna College",
    "Love Babbar",
    "Aditya Verma",
    "GeeksforGeeks",
  ],
  webdev: [
    "CodeWithHarry",
    "Traversy Media",
    "Hitesh Choudhary",
    "freeCodeCamp",
    "The Net Ninja",
  ],
  ml: [
    "Krish Naik",
    "Codebasics",
    "CampusX",
    "Tech With Tim",
    "Nicholas Renotte",
  ],
  systemDesign: [
    "Gaurav Sen",
    "ByteByteGo",
    "Tech Dummies - Narendra L",
    "Design Gurus",
  ],
  coreCS: [
    "Gate Smashers",
    "Knowledge Gate",
    "Neso Academy",
    "Jenny’s Lectures",
  ],
  interview: [
    "Apna College",
    "Anuj Bhaiya",
    "Scaler",
    "Love Babbar",
    "takeUforward",
  ],
};

const PlayList = () => {
  const location = useLocation();
  const isMainPlaylistPage = location.pathname === "/playlist";
  const [searchData, setSearchData] = useState("");

  return (
    <div className="relative bg-gray-950 min-h-screen text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-800/10 to-transparent pointer-events-none" />

      <VideoContent searchData={searchData} />

      <div className="flex-1 w-full min-h-[90vh] px-6 py-10 flex flex-col items-center justify-start">
        {isMainPlaylistPage ? (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="text-center w-full mb-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <PlayCircle className="w-20 h-20 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl font-bold text-white mt-4"
              >
                Select a Playlist
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gray-400 mt-2 text-sm"
              >
                Explore curated YouTube playlists for learning and leveling up.
              </motion.p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mt-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {Object.entries(videoContent).map(([category, channels], i) => (
                <motion.div
                  key={category}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 30px rgba(59,130,246,0.4)",
                  }}
                  className="bg-gray-900/60 border border-gray-800/60 backdrop-blur-lg rounded-2xl p-6 w-80 transition-all duration-300 hover:bg-gray-900/80"
                >
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-semibold mb-4 capitalize text-blue-400"
                  >
                    {category === "dsa"
                      ? "DSA / Coding"
                      : category === "webdev"
                      ? "Web Development"
                      : category === "ml"
                      ? "Machine Learning"
                      : category === "systemDesign"
                      ? "System Design"
                      : category === "coreCS"
                      ? "Core CS Subjects"
                      : "Interview Prep"}
                  </motion.h3>

                  <ul className="space-y-3">
                    {channels.map((ch, idx) => (
                      <motion.li
                        key={idx}
                        whileHover={{ x: 10, scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() => setSearchData(ch)}
                        className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-blue-400"
                      >
                        <Youtube className="w-5 h-5 text-red-500" />
                        <span className="truncate">{ch}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default PlayList;
