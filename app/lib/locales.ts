export const SUPPORTED_LOCALES = ["en", "ha", "ig", "yo"] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];
