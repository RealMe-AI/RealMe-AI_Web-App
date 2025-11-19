// zustand/useThemeStore.ts
import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  // Lazy initializer for theme
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved) return saved;

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  };

  const initialTheme = getInitialTheme();

  // Apply initial theme class
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }

  return {
    theme: initialTheme,
    setTheme: (theme) => {
      set({ theme });
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
      }
    },
    toggleTheme: () =>
      set((state) => {
        const next = state.theme === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
          localStorage.setItem("theme", next);
        }
        return { theme: next };
      }),
  };
});
