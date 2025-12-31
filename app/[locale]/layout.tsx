import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../theme-provider/theme-provider";
import { getStructuredData } from "../seo/structuredData";
import type { Metadata } from "next";

import StructuredData from "./components/StructuredData";

import "../globals.css";

import { SUPPORTED_LOCALES, type Locale } from "@/app/lib/locales";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export function generateStaticParams(): { locale: Locale }[] {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params; // Await the params Promise

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pathname = locale === "en" ? "" : `/${locale}`;
  const canonical = new URL(`${SITE_URL}${pathname}/`);

  const title = "RealMe AI — Converse. Learn. Evolve.";
  const description =
    "RealMe AI — Conversational AI for personal and professional growth.";

  const images = [
    {
      url: `${SITE_URL}/og/og-default.png`,
      width: 1200,
      height: 630,
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
    other: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          "google-site-verification":
            process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        }
      : {},
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
  const locale = localeString as Locale; //  assertion to Locale

  let messages: Messages;
  try {
    messages = (await import(`../i18n/${locale}`)).default;
  } catch (error) {
    console.error("Failed to load messages:", error);
    messages = {} as Messages;
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const structuredData = getStructuredData(SITE_URL);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <StructuredData data={{ "@graph": structuredData }} />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
