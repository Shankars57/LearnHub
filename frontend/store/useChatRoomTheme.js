import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatRoomTheme = create(
  persist(
    (set) => ({
      theme: "vs-dark",
      roomNames: [],
      currentChatRoom: "",
      setRoomNames: (roomNames) => set({ roomNames }),
      setCurrentChatRoom: (name) => set({ currentChatRoom: name }),

      setTheme: (t) => set({ theme: t }),
    }),
    { name: "chatroom-theme" }
  )
);
