import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatRoomTheme = create(
  persist(
    (set) => ({
      theme: "vs-dark",
      roomNames: [],
      roomState: false,
      currentChatRoom: "",
      roomId: {},
      setRoomId: (name, id) => set({ roomId: { name, id } }),
      setRoomNames: (roomNames) => set({ roomNames }),
      setCurrentChatRoom: (name) => set({ currentChatRoom: name }),
      setRoomState: (state) => set({ roomState: state }),
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "chatroom-theme" }
  )
);
