import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";
import { Poppins } from "next/font/google";

import { getStructuredData } from "../lib/structuredData";
import type { Metadata, Viewport } from "next";
import { StatusBarHandler } from "./components/StatusBarHandler";
import { PathHistoryRecorder } from "./components/PathHistoryRecorder";
import { ToastProvider } from "@/app/lib/ToastProvider";
import { AuthProvider } from "./components/AuthProvider";
import StructuredData from "./components/StructuredData";
import PwaRegister from "./components/pwa/PwaRegister";
import InstallAppPrompt from "./components/pwa/InstallAppPrompt";
import "../globals.css";
import "highlight.js/styles/atom-one-dark.css";
import { SUPPORTED_LOCALES, type Locale } from "@/app/lib/locales";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});
const SITE_URL = "https://realme.com.ng";

export function generateStaticParams(): { locale: Locale }[] {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const pathname = locale === "en" ? "" : `/${locale}`;
  const canonical = new URL(`${SITE_URL}${pathname}/`);

  const title = {
    default: "RealMe AI | Multilingual AI Assistant",
    template: "%s | RealMe AI",
  };
  const description =
    "RealMe AI is a multilingual AI assistant that helps you chat, write, translate, learn, create, and communicate naturally with voice and text in English, Hausa, Igbo, and Yoruba.";

  const images = [
    {
      url: `${SITE_URL}/og-logo.png`,
      width: 600,
      height: 600,
      alt: "RealMe AI",
    },
  ];

  const languages: Record<Locale, string> = {} as Record<Locale, string>;
  SUPPORTED_LOCALES.forEach((l) => {
    const path = l === "en" ? "/" : `/${l}/`;
    languages[l] = `${SITE_URL}${path}`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: "RealMe AI",
    manifest: "/manifest.webmanifest",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    appleWebApp: {
      capable: true,
      title: "RealMe AI",
      statusBarStyle: "default",
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
    },
    icons: {
      icon: [
        {
          url: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/icons/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },

    alternates: {
      canonical: canonical.toString(),
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical.toString(),
      images,
      siteName: "RealMe AI",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeString } = await params;
  const locale = localeString as Locale;

  let messages: Messages;
  try {
    messages = (await import(`../i18n/${locale}`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    messages = {} as Messages;
  }

  const structuredData = getStructuredData(SITE_URL);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <StructuredData data={{ "@graph": structuredData }} />
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StatusBarHandler />
            <PathHistoryRecorder />
            <ToastProvider>{children}</ToastProvider>
            <PwaRegister />
            <InstallAppPrompt />
            <Analytics />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
