// app/i18n/getRequestConfig.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type SupportedLocale = typeof routing.locales[number];

export default getRequestConfig(
  async ({
    requestLocale,
  }: {
    requestLocale: Promise<string | undefined>;
  }) => {
    let locale = await requestLocale;

    console.log("=== i18n/request.ts getRequestConfig ===");
    console.log("Received locale:", locale);
    console.log("Valid locales:", routing.locales);

    // Validate locale strictly
    if (!locale || !routing.locales.includes(locale as SupportedLocale)) {
      console.log("LOCALE NOT VALID - using default");
      locale = routing.defaultLocale;
    }

    const finalLocale = locale as SupportedLocale;

    console.log("Loading messages for locale:", finalLocale);

    // Dynamic import with full typing
    const messages: Record<string, unknown> = (
      await import(`../i18n/${finalLocale}.ts`)

    ).default;

    console.log("Messages loaded successfully");

    return {
      locale: finalLocale,
      messages,
    };
  }
);
