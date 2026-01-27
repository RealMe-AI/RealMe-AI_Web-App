import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Default path (looks for i18n.ts in root)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // your Next.js config options
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "realme-ai-jf2e.onrender.com",
      },
      {
        protocol: "http",
        hostname: "realme-ai-jf2e.onrender.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
