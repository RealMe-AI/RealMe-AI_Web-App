const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const lines = [
    "User-agent: *",
    "Disallow: /d",
    "Disallow: /api/private",
    "Allow: /",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
