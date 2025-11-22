import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../../app/theme-provider/theme-provider";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Supported locales
export const SUPPORTED_LOCALES = ["en", "ha", "ig", "yo"] as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const metadata = {
  title: "RealMe AI",
  description: "Converse. Learn. Evolve. Professionally.",
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!SUPPORTED_LOCALES.includes(locale as typeof SUPPORTED_LOCALES[number])) {
    notFound();
  }

  // Dynamically import translation file
  let messages: Messages;
  try {
    messages = (await import(`../i18n/${locale}.ts`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}