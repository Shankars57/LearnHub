import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTheme = create(
  persist(
    (set) => ({
      theme: "vs-light",
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "admin-theme" }
  )
);
