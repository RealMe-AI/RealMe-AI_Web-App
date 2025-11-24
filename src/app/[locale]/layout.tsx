// import { ReactNode } from "react";
// import { notFound } from "next/navigation";
// import { NextIntlClientProvider } from "next-intl";
// import type { Messages } from "../i18n/en";
// import { Poppins } from "next/font/google";
// import { ThemeProvider } from "../theme-provider/theme-provider";
// import "../globals.css";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
//   variable: "--font-poppins",
// });

// export const SUPPORTED_LOCALES = ["en", "ha", "ig", "yo"] as const;

// // export function generateStaticParams() {
// //   return SUPPORTED_LOCALES.map((locale) => ({ locale }));
// // }

// export const metadata = {
//   title: "RealMe AI",
//   description: "Converse. Learn. Evolve. Professionally.",
// };

// interface LocaleLayoutProps {
//   children: ReactNode;
//   params: Promise<{ locale: string }>;
// }

// export default async function LocaleLayout({
//   children,
//   params,
// }: LocaleLayoutProps) {
//   const { locale } = await params;

//   console.log("=== LAYOUT EXECUTING ===");
//   console.log("Locale:", locale);
//   console.log("Supported:", SUPPORTED_LOCALES);

//   // Validate locale
//   if (
//     !SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])
//   ) {
//     console.log("LOCALE NOT FOUND - calling notFound()");
//     notFound();
//   }

//   // Dynamically import translation file
//   let messages: Messages;
//   // In the layout, after loading messages:
//   try {
//     messages = (await import(`../i18n/${locale}.ts`)).default;
//     console.log("Messages loaded successfully");
//     console.log("Messages keys:", Object.keys(messages));
//     console.log(
//       "Messages content:",
//       JSON.stringify(messages).substring(0, 200)
//     );
//   } catch (error) {
//     console.log("Failed to load messages:", error);
//     notFound();
//   }

//   return (
//     <html lang={locale} suppressHydrationWarning>
//       <body className={`${poppins.className} antialiased`}>
//         <ThemeProvider>
//           <NextIntlClientProvider locale={locale} messages={messages}>
//             {children}
//           </NextIntlClientProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

// app/[locale]/layout.tsx
import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import type { Messages } from "../i18n/en";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../theme-provider/theme-provider";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string } | Promise<{ locale: string }>; // can be a Promise
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await params if it's a Promise
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!locale) {
    throw new Error("Locale is undefined");
  }

  // Load translations dynamically
  let messages: Messages;
  try {
    messages = (await import(`../i18n/${locale}`)).default;
  } catch (e) {
    console.error(`No messages found for locale: ${locale}`, e);
    messages = (await import(`../i18n/en`)).default; // fallback
  }

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
