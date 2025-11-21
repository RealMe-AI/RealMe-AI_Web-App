// app/[locale]/layout.tsx
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import type { Messages } from "../../locales/en";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;
  unstable_setRequestLocale(locale);

  let messages: Messages;
  try {
    messages = (await import(`../../locales/${locale}.ts`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
