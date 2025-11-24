"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "ha" | "ig" | "yo";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en", // default
      setLanguage: (lang: Language) => set({ language: lang }),
    }),
    {
      name: "realme-language", // localStorage key
      getStorage: () => localStorage,
    }
  )
);
