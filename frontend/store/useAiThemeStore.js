import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAiThemeStore = create(
  persist(
    (set) => ({
      theme: "vs-dark",
      setTheme: (t) => set({ theme: t }),
    }),
    { name: "ai-theme" }
  )
);
