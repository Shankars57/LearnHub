import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { VideoIcon, Menu, X } from "lucide-react";
import useVideoStore from "../../store/useVideoStore";

const PlayLists = () => {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const { setPlaylist, setVideo } = useVideoStore();
  const [currentVideo, setCurrentVideo] = useState(null);
  const [open, setOpen] = useState(true);
  const moveUpRef = useRef(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`/api/yt/playlist/${playlistId}`);
        const items = res.data.items.filter(
          (v) => v.snippet && v.snippet.thumbnails
        );
        setVideos(items);

        if (items.length) {
          setPlaylist(items);
          setCurrentVideo(items[0]);
          setVideo(items[0]);
        }
      } catch {
        toast.error("Failed to load playlist");
      }
    };
    fetchVideos();
  }, [playlistId, setPlaylist, setVideo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[90vh] flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-20 right-4 z-50 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="flex w-full">
        <div
          ref={moveUpRef}
          className={`flex-1 flex flex-col items-center transition-all duration-300 ${
            open ? "mr-80" : "mr-0"
          } px-4 md:px-8`}
        >
          {videos.length > 0 && (
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-8 text-center"
            >
              Playlist —{" "}
              <span className="text-blue-400 capitalize">
                {videos[0]?.snippet?.channelTitle}
              </span>
            </motion.h2>
          )}

          <AnimatePresence mode="wait">
            {currentVideo && (
              <motion.div
                key={currentVideo.contentDetails.videoId}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="w-full max-w-8xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/30 border border-gray-800">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${currentVideo.contentDetails.videoId}?rel=0&modestbranding=1`}
                    title={currentVideo.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-5 text-2xl font-semibold text-white"
                >
                  {currentVideo.snippet.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hidden md:block max-w-3xl text-gray-400 mt-3 text-sm leading-relaxed"
                >
                  {currentVideo.snippet.description ||
                    "No description available for this video."}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Playlist */}
        <AnimatePresence>
          {open && (
            <motion.aside
              initial={{ x: 200 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-20 right-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto p-4 z-40 custom-scrollbar pointer-events-auto"
            >
              <h2 className="text-lg font-bold mb-4 text-center">
                Playlist Videos
              </h2>
              {videos.map((v) => {
                const { snippet } = v;
                if (!snippet || !snippet.thumbnails) return null;

                const thumbnailUrl =
                  snippet.thumbnails.medium?.url ||
                  snippet.thumbnails.default?.url ||
                  "/fallback.jpg";

                const isPlaying =
                  currentVideo?.contentDetails.videoId ===
                  v.contentDetails.videoId;

                return (
                  <motion.div
                    key={v.contentDetails.videoId}
                    onClick={() => {
                      setCurrentVideo(v);
                      setVideo(v);
                      setOpen(false);
                      moveUpRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`flex gap-3 mb-4 cursor-pointer rounded-lg p-2 border transition-all duration-300 ${
                      isPlaying
                        ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-600/30"
                        : "border-gray-700 hover:border-blue-500 hover:bg-gray-800/60"
                    }`}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={snippet.title}
                      className="w-20 h-16 rounded-md object-cover"
                    />
                    <div className="flex flex-col justify-between text-sm">
                      <p className="font-semibold line-clamp-2">
                        {snippet.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {snippet.videoOwnerChannelTitle}
                      </p>
                      {isPlaying && (
                        <div className="flex items-center gap-1 text-blue-400 text-xs">
                          <VideoIcon size={14} /> Playing
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PlayLists;
