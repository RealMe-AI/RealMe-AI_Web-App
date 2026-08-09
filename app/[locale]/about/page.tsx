import type { Metadata } from "next";
import { About } from "./About";
import { SITE_URL } from "@/app/lib/siteUrl";

export const metadata: Metadata = {
  title: "About Us & Founders",
  description:
    "Learn about RealMe AI, our mission, vision, and the founders — Agunwa Chidiebele Calistus and Ezechukwu Chukwudubem Daniel building a multilingual AI for everyone.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us & Founders | RealMe AI",
    description:
      "Learn about RealMe AI, our mission, vision, and the founders building a multilingual AI for everyone.",
    url: `${SITE_URL}/about`,
    siteName: "RealMe AI",
    images: [
      {
        url: `${SITE_URL}/agunwa.jpeg`,
        width: 810,
        height: 1080,
        alt: "Agunwa Chidiebele Calistus — Founder, RealMe AI",
      },
      {
        url: `${SITE_URL}/daniel.jpeg`,
        width: 400,
        height: 400,
        alt: "Ezechukwu Chukwudubem Daniel — Co-Founder, RealMe AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us & Founders | RealMe AI",
    description:
      "Learn about RealMe AI, our mission, vision, and the founders building a multilingual AI for everyone.",
    images: [`${SITE_URL}/agunwa.jpeg`],
  },
};

export default function AboutPage() {
  return <About />;
}