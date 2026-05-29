import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar', 'es', 'fr', 'pt', 'de', 'zh', 'hi', 'ja', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
