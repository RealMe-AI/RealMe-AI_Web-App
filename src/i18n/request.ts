// // app/i18n/getRequestConfig.ts
// import { getRequestConfig } from "next-intl/server";
// import { notFound } from "next/navigation";

// // Supported locales
// const locales = ["en", "ha", "ig", "yo"];

// export default getRequestConfig(async ({ locale }) => {
//   // Ensure locale is defined
//   if (!locale || !locales.includes(locale)) notFound();

//   // TypeScript now knows locale is a string
//   const messages = (await import(`../app/i18n/${locale}.ts`)).default;

//   return {
//     locale,   // definitely a string here
//     messages, // translation messages
//   };
// });

import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["en", "ha", "ig", "yo"] as const;

export default getRequestConfig(async ({ locale }) => {
  console.log("=== i18n/request.ts ===");
  console.log("Locale received:", locale);
  console.log("Type of locale:", typeof locale);
  
  // Handle undefined locale
  if (!locale) {
    console.log("❌ Locale is undefined!");
    notFound();
  }
  
  // Now TypeScript knows locale is defined
  if (!locales.includes(locale as any)) {
    console.log("❌ Locale not in supported list:", locale);
    notFound();
  }

  console.log("✅ Locale is valid, loading messages...");

  const messages = (await import(`../app/i18n/${locale}.ts`)).default;

  return {
    locale,    // Add this back
    messages,
  };
});