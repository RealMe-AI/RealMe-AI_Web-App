import "./globals.css";

import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { IntlProvider } from "next-intl";


import type { Messages } from "../locales/en"; // typed import of your en.ts

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "RealMe AI",
  description: "Converse. Learn. Evolve. Professionally.",
};

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string }; // Next.js App Router param for locale
  messages: Messages; // loaded locale messages
}

export default function RootLayout({
  children,
  params,
  messages,
}: RootLayoutProps) {
  return (
    <html lang={params.locale || "en"} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          <IntlProvider locale={params.locale || "en"} messages={messages}>
            {children}
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
