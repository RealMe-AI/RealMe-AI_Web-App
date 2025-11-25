// app/i18n/getRequestConfig.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  console.log("=== i18n/request.ts getRequestConfig ===");
  console.log("Received locale:", locale);
  console.log("Valid locales:", routing.locales);

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    console.log("LOCALE NOT VALID - using default");
    locale = routing.defaultLocale;
  }

  console.log("Loading messages for locale:", locale);
  // TypeScript now knows locale is a string
  const messages = (await import(`../app/i18n/${locale}`)).default;
  console.log("Messages loaded successfully");

  return {
    locale,
    messages,
  };
});
