import { SITE_URL } from "@/app/lib/siteUrl";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/d", "/api/private"],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}