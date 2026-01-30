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

      // Cloudinary for avatar uploads
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      // Common image storage providers
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
