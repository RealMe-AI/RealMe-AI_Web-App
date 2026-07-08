"use client";

import { useTranslations } from "next-intl";
import { useLanguageStore, type Language } from "../store/useLanguageStore";
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
    if (language === "en" && !localStorage.getItem("lang")) {
      const browserLang = (navigator.language.slice(0, 2) as Language) ?? "en";
      const langToSet = SUPPORTED_LANGS.includes(browserLang)
        ? browserLang
        : "en";
      setLanguage(langToSet);
    }
  }, [language, setLanguage]);

  // Translation function using Next-Intl
  // The key can be nested like "landing.hero.title"
  const t = useTranslations();

  return { t, language, setLanguage };
}
