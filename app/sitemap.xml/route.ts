import { SUPPORTED_LOCALES } from "@/app/lib/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const PAGES = ["", "about", "pricingplans", "help"];

function buildUrl(path: string, locale: string) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  const clean = path === "" ? "" : `/${path}`;
  return `${SITE_URL}${prefix}${clean}`;
}

export async function GET() {
  const urls: string[] = [];

  for (const page of PAGES) {
    for (const locale of SUPPORTED_LOCALES) {
      const loc = buildUrl(page, locale);
      urls.push(
        `<url><loc>${loc}</loc><lastmod>${new Date().toISOString()}</lastmod>` +
          SUPPORTED_LOCALES
            .map((l) => {
              const href = buildUrl(page, l);
              return `<xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`;
            })
            .join("") +
          `</url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.join("\n")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
