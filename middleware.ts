import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Match your SUPPORTED_LOCALES
  locales: ['en', 'ha', 'ig', 'yo'],
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ha|ig|yo|en)/:path*']
};
