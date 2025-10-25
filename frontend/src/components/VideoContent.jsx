import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VideoContent = ({ searchData }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchData) {
      setQuery(searchData);
      setOpen(true);
      inputRef.current?.focus();
      fetchPlaylists(searchData);
    }
  }, [searchData]);

  const fetchPlaylists = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/yt/search?q=${encodeURIComponent(searchQuery)}`
      );
      setResults(res.data.items || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to fetch playlists");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return toast.error("Please enter a search term");
    await fetchPlaylists(query);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-20 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 z-40 w-72 md:w-80 h-full bg-gray-900 text-white border-r border-gray-800 px-5 py-10 shadow-2xl overflow-y-auto custom-scrollbar"
          >
            <header className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">YouTube Playlists</h1>
              <p className="text-gray-400 text-sm">Search & Explore Channels</p>
            </header>

            <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
              <input
                type="text"
                ref={inputRef}
                value={query}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search playlists..."
                className="flex-1 bg-gray-800 border border-gray-700 p-2 rounded-md text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Search
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center mt-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"
                />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {results.map((item, index) => (
                  <motion.div
                    key={`${item.playlistId}-${index}`}
                    className="relative bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-700 hover:border-blue-500 hover:bg-gray-800/80 transition-all"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => {
                      navigate(`/playlist/${item.playlistId}`);
                      setOpen(false);
                    }}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-36 object-cover"
                      loading="lazy"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center"
                    >
                      <Play className="text-white w-8 h-8" />
                    </motion.div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {item.channelTitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-20 text-sm">
                Search for playlists to see results
              </p>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideoContent;
