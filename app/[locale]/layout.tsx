import { ReactNode, use } from "react";
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
  params: { locale: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  // Unwrap the locale from params using React.use()
  const { locale } = params;

  // Unwrap the translation file at top level
  const messagesModule = use(import(`../i18n/${locale}.ts`));
  const messages: Messages = messagesModule?.default;

  // If messages fail to load (undefined), fallback to 404
  if (!messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
