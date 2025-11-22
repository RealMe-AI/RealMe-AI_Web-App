// // app/i18n/getRequestConfig.ts
// import { getRequestConfig } from "next-intl/server";
// import { notFound } from "next/navigation";

// // Supported locales
// const locales = ["en", "ha", "ig", "yo"];

// export default getRequestConfig(async ({ locale }) => {
//   // Ensure locale is defined
//   if (!locale || !locales.includes(locale)) notFound();

//   // TypeScript now knows locale is a string
//   const messages = (await import(`./${locale}.ts`)).default;

//   return {
//     locale,   // definitely a string here
//     messages, // translation messages
//   };
// });
