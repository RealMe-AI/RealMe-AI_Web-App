// i18n.ts (in root)
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["en", "ha", "ig", "yo"];

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale)) notFound();

  // Updated path: now it's ./app/i18n/
  const messages = (await import(`./app/i18n/${locale}.ts`)).default;

  return {
    locale,
    messages,
  };
});