import React, { useEffect, useRef } from "react";
import useVideoStore from "../../store/useVideoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const PersistentPlayer = () => {
  const { currentVideo, clearVideo, recentPlayLists } = useVideoStore();
  const playerRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentVideo && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentVideo]);

  const isInPlaylistPage = location.pathname.startsWith("/playlist");

  const handleNavigate = () => {
    if (!recentPlayLists?.id) return;
    navigate(`/playlist/${recentPlayLists.id}`);
  };

  return (
    <AnimatePresence>
      {currentVideo && !isInPlaylistPage && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 shadow-xl rounded-xl overflow-hidden w-[400px] h-[225px] z-50 cursor-pointer"
          ref={playerRef}
        >
          <div className="relative flex justify-between items-center bg-gray-800 px-2 py-1 text-xs text-gray-300">
            <p className="truncate">{currentVideo.snippet?.title}</p>
            <button
              onClick={handleNavigate}
              className="px-2  flex items-center 
             bg-black/70 
             rounded-lg
             "
            >
              Go To playList
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                clearVideo();
              }}
            >
              <X size={14} />
            </button>
          </div>
          <iframe
            src={`https://www.youtube.com/embed/${currentVideo.contentDetails.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={currentVideo.snippet?.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[200px]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersistentPlayer;
