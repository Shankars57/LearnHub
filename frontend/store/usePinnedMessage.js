
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePinnedMessage = create(
  persist(
    (set) => ({
      pinnedMessages: {},

      setPinnedMessage: (roomId, message) =>
        set((state) => ({
          pinnedMessages: { ...state.pinnedMessages, [roomId]: message },
        })),

      clearPinnedMessage: (roomId) =>
        set((state) => {
          const updated = { ...state.pinnedMessages };
          delete updated[roomId];
          return { pinnedMessages: updated };
        }),
    }),
    {
      name: "chat-pinned-messages", 
    }
  )
);

export default usePinnedMessage;
