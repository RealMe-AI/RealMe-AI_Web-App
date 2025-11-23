import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ha', 'ig', 'yo'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ha|ig|yo|en)/:path*']
};