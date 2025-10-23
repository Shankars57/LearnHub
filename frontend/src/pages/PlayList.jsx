import React from "react";
import VideoContent from "../components/VideoContent";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

const PlayList = () => {
  const location = useLocation();
  const isMainPlaylistPage = location.pathname === "/playlist"; 

  return (
    <div className="relative bg-gray-950 min-h-[90vh] text-white overflow-hidden">
  
      <VideoContent />

    
      <div className="flex-1 w-full min-h-[90vh] p-6 transition-all duration-300 flex items-center justify-center">
        {isMainPlaylistPage ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-400 max-w-lg"
          >
            <PlayCircle className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Select a Playlist
            </h2>
            <p className="text-gray-400">
              Search and choose a playlist from the sidebar to start exploring
              videos.
            </p>
          </motion.div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default PlayList;
