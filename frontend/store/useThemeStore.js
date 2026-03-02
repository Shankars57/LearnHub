import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useChatRoomTheme } from "./useChatRoomTheme";
import { useAIThemeStore } from "./AIStore/useAiThemeStore";
import { useAiThemeStore } from "./useAiThemeStore";

export const appThemeOptions = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "moderate", label: "Moderate" },
];

const isValidTheme = (theme) =>
  appThemeOptions.some((themeOption) => themeOption.id === theme);

const applyTheme = (theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
};

const appThemeToEditorTheme = {
  dark: "vs-dark",
  light: "vs-light",
  moderate: "ai-theme",
};

const syncNestedThemeStores = (theme) => {
  const mappedTheme = appThemeToEditorTheme[theme] || "vs-dark";

  try {
    useChatRoomTheme.getState().setTheme(mappedTheme);
  } catch {}

  try {
    useAIThemeStore.getState().setTheme(mappedTheme);
  } catch {}

  try {
    useAiThemeStore.getState().setTheme(mappedTheme);
  } catch {}
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (nextTheme) => {
        const safeTheme = isValidTheme(nextTheme) ? nextTheme : "dark";
        applyTheme(safeTheme);
        syncNestedThemeStores(safeTheme);
        set({ theme: safeTheme });
      },
      initTheme: () => {
        const selectedTheme = isValidTheme(get().theme) ? get().theme : "dark";
        applyTheme(selectedTheme);
        syncNestedThemeStores(selectedTheme);
      },
    }),
    {
      name: "app-theme",
      onRehydrateStorage: () => (state) => {
        const hydratedTheme =
          state && isValidTheme(state.theme) ? state.theme : "dark";
        applyTheme(hydratedTheme);
        syncNestedThemeStores(hydratedTheme);
      },
    }
  )
);
