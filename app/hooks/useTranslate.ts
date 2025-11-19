"use client";

import { useEffect, useState } from "react";
import { useLanguageStore, Language } from "../zustand/useLanguageStore";

export type Translations = Record<string, string>;

const SUPPORTED_LANGS: Language[] = ["en", "ha", "ig", "yo"];

// Cache already loaded translations to avoid repeated dynamic imports
const translationCache: Record<Language, Translations> = {};

interface UseTranslateReturn {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function useTranslate(): UseTranslateReturn {
  const { language, setLanguage } = useLanguageStore();
  const [translations, setTranslations] = useState<Translations>({});

  // Detect browser language on first load
  useEffect(() => {
    const storedLang = localStorage.getItem("realme-language") as Language | null;
    if (!storedLang) {
      const browserLang = navigator.language.slice(0, 2) as Language;
      const langToSet = SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
      setLanguage(langToSet);
    }
  }, [setLanguage]);

  // Load translation file whenever language changes
  useEffect(() => {
    async function loadTranslations() {
      try {
        if (translationCache[language]) {
          setTranslations(translationCache[language]);
        } else {
          const file = await import(`@/i18n/${language}.ts`);
          translationCache[language] = file.default;
          setTranslations(file.default);
        }
      } catch (err) {
        console.error("Failed to load translations:", err);
        setTranslations({});
      }
    }
    loadTranslations();
  }, [language]);

  // Translation function: supports simple keys
  const t = (key: string) => translations[key] ?? key;

  return { t, language, setLanguage };
}
