// // app/layout.tsx
// import "./globals.css";
// import { ReactNode } from "react";
// import { Poppins } from "next/font/google";
// import { ThemeProvider } from "./app/theme-provider/theme-provider";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
//   variable: "--font-poppins",
// });

// export const metadata = {
//   title: "RealMe AI",
//   description: "Converse. Learn. Evolve. Professionally.",
// };

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${poppins.className} antialiased`}>
//         <ThemeProvider>{children}</ThemeProvider>
//       </body>
//     </html>
//   );
// }
