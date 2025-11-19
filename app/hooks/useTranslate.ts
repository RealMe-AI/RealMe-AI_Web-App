"use client";

import { useEffect, useState } from "react";
import { useLanguageStore, Language } from "../zustand/useLanguageStore";

export type Translations = Record<string, string>;

const SUPPORTED_LANGS: Language[] = ["en", "ha", "ig", "yo"];

export function useTranslate() {
  const { language, setLanguage } = useLanguageStore();
  const [translations, setTranslations] = useState<Translations>({});

  // Detect browser language on first load
  useEffect(() => {
    const storedLang = localStorage.getItem("realme-language");
    if (!storedLang) {
      const browserLang = navigator.language.slice(0, 2) as Language;
      const langToSet = SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
      setLanguage(langToSet);
    }
  }, [setLanguage]);

  // Dynamically load translation file whenever language changes
  useEffect(() => {
    async function loadTranslations() {
      try {
        const file = await import(`@/i18n/${language}.ts`);
        setTranslations(file.default);
      } catch (err) {
        console.error("Failed to load translations:", err);
        setTranslations({});
      }
    }
    loadTranslations();
  }, [language]);

  // Return a function to fetch translation by key
  const t = (key: string) => translations[key] ?? key;

  return t;
}
