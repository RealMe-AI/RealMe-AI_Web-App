import { SITE_URL } from "@/app/lib/siteUrl";
import type { MetadataRoute } from "next";

const H = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${H}/en`,
      changeFrequency: "weekly",
      images: [`${H}/realme-ai-assistant.webp`, `${H}/realme-ai-chatbot.webp`],
    },
    { url: `${H}/ha`, changeFrequency: "weekly" },
    { url: `${H}/ig`, changeFrequency: "weekly" },
    { url: `${H}/yo`, changeFrequency: "weekly" },
    {
      url: `${H}/en/about`,
      changeFrequency: "monthly",
      images: [`${H}/agunwa.jpeg`, `${H}/daniel.jpeg`],
    },
    { url: `${H}/ha/about`, changeFrequency: "monthly" },
    { url: `${H}/ig/about`, changeFrequency: "monthly" },
    { url: `${H}/yo/about`, changeFrequency: "monthly" },
  ];
}