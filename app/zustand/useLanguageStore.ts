"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Language = "en" | "ha" | "ig" | "yo";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en", // default
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "realme-language",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
