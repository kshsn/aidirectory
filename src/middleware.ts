import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const SUPPORTED_LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale;

// Map country codes to locales
const COUNTRY_TO_LOCALE: Record<string, string> = {
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', KW: 'ar', BH: 'ar',
  QA: 'ar', OM: 'ar', IQ: 'ar', SY: 'ar', LB: 'ar', MA: 'ar',
  DZ: 'ar', TN: 'ar', LY: 'ar', YE: 'ar', SD: 'ar',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es',
  CL: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es',
  HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es',
  UY: 'es',
  // Portuguese
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt',
  // German
  DE: 'de', AT: 'de', CH: 'de', LU: 'de',
  // French
  FR: 'fr', BE: 'fr', CA: 'fr', SN: 'fr', CI: 'fr', CM: 'fr',
  // Chinese
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh',
  // Hindi
  IN: 'hi',
  // Japanese
  JP: 'ja',
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru',
};

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip for admin, api, static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // If already on a locale path, just run intl middleware
  const hasLocalePrefix = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocalePrefix) {
    return intlMiddleware(request);
  }

  // Root path — detect locale from cookie or IP
  const cookieLocale = request.cookies.get('preferred-locale')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as typeof SUPPORTED_LOCALES[number])) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, request.url));
  }

  // Try IP geolocation
  const country = request.headers.get('x-country') || // CDN header (Cloudflare etc.)
                  request.headers.get('cf-ipcountry');  // Cloudflare specifically
  let detectedLocale = DEFAULT_LOCALE;

  if (country && COUNTRY_TO_LOCALE[country.toUpperCase()]) {
    detectedLocale = COUNTRY_TO_LOCALE[country.toUpperCase()];
  } else {
    // Fallback: Accept-Language header
    const acceptLanguage = request.headers.get('accept-language') || '';
    const primaryLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
    if (primaryLang && SUPPORTED_LOCALES.includes(primaryLang as typeof SUPPORTED_LOCALES[number])) {
      detectedLocale = primaryLang;
    }
  }

  const response = NextResponse.redirect(new URL(`/${detectedLocale}${pathname === '/' ? '' : pathname}`, request.url));
  response.cookies.set('preferred-locale', detectedLocale, { maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)']
};
