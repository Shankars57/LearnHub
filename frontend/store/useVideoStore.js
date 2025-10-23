import { create } from "zustand";
import { persist } from "zustand/middleware";

const useVideoStore = create(
  persist(
    (set, get) => ({
      currentPlaylist: null,
      currentVideo: null,
      recentPlaylists: [],
      setPlaylist: (playlist) => {
        set({ currentPlaylist: playlist });

        const recent = [...get().recentPlaylists];
        const firstVideo = playlist[0];
        if (firstVideo) {
          const newEntry = {
            id: firstVideo.snippet.playlistId,
            title: firstVideo.snippet.title,
            thumbnail: firstVideo.snippet.thumbnails.medium.url,
            description: firstVideo.snippet.description || "",
          };

          const filtered = recent.filter((p) => p.id !== newEntry.id);
          filtered.unshift(newEntry);

          if (filtered.length > 12) filtered.pop();
          set({ recentPlaylists: filtered });
        }
      },
      setVideo: (video) => set({ currentVideo: video }),
      reset: () => set({ currentPlaylist: null, currentVideo: null }),
    }),
    { name: "video-store" }
  )
);

export default useVideoStore;
