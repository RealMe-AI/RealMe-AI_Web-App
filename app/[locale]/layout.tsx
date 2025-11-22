import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "ha" },
    { locale: "ig" },
    { locale: "yo" },
  ];
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string }; // <-- plain object, no Promise
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params; // <-- no await needed

  let messages: Messages;

  try {
    messages = (await import(`../i18n/${locale}.ts`)).default;
  } catch {
    notFound(); // fallback to 404 if the locale file is missing
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
