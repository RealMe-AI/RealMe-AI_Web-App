"use client";

import { useTranslations } from "next-intl";
import { useLanguageStore, type Language } from "../zustand/useLanguageStore";
import { useEffect } from "react";

const SUPPORTED_LANGS: Language[] = ["en", "ha", "ig", "yo"];

interface UseTranslateReturn {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function useTranslate(): UseTranslateReturn {
  const { language, setLanguage } = useLanguageStore();

  // Detect browser language on first load
  useEffect(() => {
    const storedLang = localStorage.getItem("realme-language") as Language | null;
    if (!storedLang) {
      const browserLang = (navigator.language.slice(0, 2) as Language) ?? "en";
      const langToSet = SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
      setLanguage(langToSet);
      localStorage.setItem("realme-language", langToSet);
    }
  }, [setLanguage]);

  // Translation function using Next-Intl
  // The key can be 
  const t = useTranslations();

  return { t, language, setLanguage };
}
