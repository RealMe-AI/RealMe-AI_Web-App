import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeStore {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyThemeClass(resolved: "light" | "dark") {
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }
}

let mediaQuery: MediaQueryList | null = null;
let cleanupListener: (() => void) | null = null;

function listenForSystemChanges(callback: (resolved: "light" | "dark") => void) {
  if (typeof window === "undefined") return;

  cleanupListener?.();
  cleanupListener = null;

  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => callback(getSystemTheme());
  mediaQuery.addEventListener("change", handler);
  cleanupListener = () => mediaQuery?.removeEventListener("change", handler);
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "system" as Theme,
      resolvedTheme: "light" as "light" | "dark",

      setTheme: (theme: Theme) => {
        const resolved = resolveTheme(theme);
        applyThemeClass(resolved);
        set({ theme, resolvedTheme: resolved });

        if (theme === "system") {
          listenForSystemChanges((r) => {
            applyThemeClass(r);
            set({ resolvedTheme: r });
          });
        } else {
          cleanupListener?.();
          cleanupListener = null;
        }
      },

      toggleTheme: () => {
        const { resolvedTheme } = get();
        const next = resolvedTheme === "light" ? "dark" : "light";
        applyThemeClass(next);
        set({ theme: next, resolvedTheme: next });
        cleanupListener?.();
        cleanupListener = null;
      },
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.theme);
          applyThemeClass(resolved);
          state.resolvedTheme = resolved;

          if (state.theme === "system") {
            listenForSystemChanges((r) => {
              applyThemeClass(r);
              useThemeStore.setState({ resolvedTheme: r });
            });
          }
        }
      },
    }
  )
);
