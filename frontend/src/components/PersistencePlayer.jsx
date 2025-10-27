import React, { useEffect, useRef } from "react";
import useVideoStore from "../../store/useVideoStore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const PersistentPlayer = () => {
  const { currentVideo, clearVideo } = useVideoStore();
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
    if (!currentVideo?.snippet?.playlistId) {
      console.log("Something wrong", currentVideo);
      return;
    }
    navigate(`/playlist/${currentVideo.snippet.playlistId}`);
  };

  return (
    <AnimatePresence>
      {currentVideo && !isInPlaylistPage && (
        <motion.div
          ref={playerRef}
          drag
          dragMomentum={false}
          dragElastic={0.2}
          dragConstraints={{
            top: -window.innerHeight * 0.8, 
            left: -window.innerWidth * 0.8, 
            right: window.innerWidth * 0.8, 
            bottom: window.innerHeight * 0.5,
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 shadow-xl rounded-xl overflow-hidden w-[400px] h-[225px] z-50 cursor-grab active:cursor-grabbing"
        >
          <div className="relative flex justify-between items-center bg-gray-800 px-2 py-1 text-xs text-gray-300 select-none">
            <p className="truncate">{currentVideo.snippet?.title}</p>

            <div className="flex items-center gap-1">
              <button
                onClick={handleNavigate}
                className="px-2 py-1 bg-black/70 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Go To Playlist
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
