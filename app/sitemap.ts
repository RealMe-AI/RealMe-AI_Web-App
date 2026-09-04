import { SITE_URL } from "@/app/lib/siteUrl";
import { SUPPORTED_LOCALES } from "@/app/lib/locales";
import type { MetadataRoute } from "next";

const H = SITE_URL;

const HOME_IMAGES = [
  `${H}/realme-ai-assistant.webp`,
  `${H}/realme-ai-chatbot.webp`,
  `${H}/logo.png`,
  `${H}/og-logo.png`,
];

const ABOUT_IMAGES = [
  `${H}/realme-banner.webp`,
  `${H}/Realme-mobile-banner.jpeg`,
  `${H}/agunwa.jpeg`,
  `${H}/daniel.jpeg`,
  `${H}/logo.png`,
];

const HELP_IMAGES = [
  `${H}/realme-banner.webp`,
  `${H}/Realme-mobile-banner.jpeg`,
  `${H}/logo.png`,
];

function localeUrls(path: string) {
  return SUPPORTED_LOCALES.map((locale) => `${H}/${locale}${path}`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localeUrls("").map((url) => ({
      url,
      changeFrequency: "weekly" as const,
      images: HOME_IMAGES,
    })),
    ...localeUrls("/about").map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      images: ABOUT_IMAGES,
    })),
    ...localeUrls("/help").map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      images: HELP_IMAGES,
    })),
    ...localeUrls("/p").map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      images: [`${H}/logo.png`],
    })),
  ];
}
