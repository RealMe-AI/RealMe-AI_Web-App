import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ha', 'ig', 'yo'],
  defaultLocale: 'en'
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};