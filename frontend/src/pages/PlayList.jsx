import React, { useState } from "react";
import VideoContent from "../components/VideoContent";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const isMainPlaylistPage = location.pathname === "/playlist";
  const [searchData, setSearchData] = useState("");
  return (
    <div className="relative bg-gray-950 min-h-[90vh] text-white overflow-hidden">
      <VideoContent searchData={searchData} />

      <div className="flex-1 w-full min-h-[90vh] p-6 transition-all duration-300 flex flex-col items-center justify-start">
        {isMainPlaylistPage ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 w-full"
          >
            <PlayCircle className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-6">
              Select a Playlist
            </h2>
            <p className="text-gray-400 mb-10">
              Choose a category below to explore top YouTube playlists for
              learning.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {Object.entries(videoContent).map(([category, channels], i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 w-80 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4 capitalize text-blue-400">
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
                  </h3>

                  <ul className="space-y-3">
                    {channels.map((ch, idx) => (
                      <motion.li
                        key={idx}
                        whileHover={{ scale: 1.05, x: 5 }}
                        className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-blue-400"
                        onClick={() => setSearchData(ch)}
                      >
                        <Youtube className="w-4 h-4 text-red-500" />
                        {ch}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default PlayList;
