import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Default path (looks for i18n.ts in root)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // your Next.js config options
};

export default withNextIntl(nextConfig);

  