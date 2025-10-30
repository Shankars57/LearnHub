import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAIThemeStore = create(
  persist(
    (set) => ({
      theme: "vs-dark",
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "ai-theme" }
  )
);
