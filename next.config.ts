import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// specify the path to your request.ts explicitly
const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

const nextConfig: NextConfig = {
  // your Next.js config options
};

export default withNextIntl(nextConfig);
