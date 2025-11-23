import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ha", "ig", "yo"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(ha|ig|yo|en)/:path*"],
};
