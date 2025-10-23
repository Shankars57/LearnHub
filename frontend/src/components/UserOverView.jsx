import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useVideoStore from "../../store/useVideoStore";

const UserOverview = () => {
  const { recentPlaylists } = useVideoStore();
  const navigate = useNavigate();

  if (!recentPlaylists.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-400 mb-4">No recent playlists available.</p>
        <button
          onClick={() => navigate("/playlist")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Explore Playlists
        </button>
      </div>
    );
  }

  const firstPlaylist = recentPlaylists[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto mt-6 bg-gray-900 rounded-2xl p-6 shadow-lg shadow-blue-900/30"
      >
        <h2 className="text-xl font-semibold mb-2">
          Recently Watched Playlists
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentPlaylists.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/playlist/${p.id}`)}
              className="cursor-pointer relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800 hover:bg-gray-800/70 transition-all duration-200"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-40 object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M4 2v20l18-10L4 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {p.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default UserOverview;
