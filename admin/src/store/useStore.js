import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      materials: [],
      chatRooms: [],
      setMaterials: (m) => set({ materials: m }),
      setChatRooms: (c) => set({ chatRooms: c }),
    }),
    {
      name: "store-data",
    }
  )
);
