import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";

// Supported locales
export const SUPPORTED_LOCALES = ["en", "ha", "ig", "yo"] as const;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>; // Changed: params is now a Promise
}

// Layout must be a Server Component (async)
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params; // Changed: await params

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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}