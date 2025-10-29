import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatRoomTheme = create(
  persist(
    (set) => ({
      theme: "vs-dark",
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "chatroom-theme" }
  )
);
