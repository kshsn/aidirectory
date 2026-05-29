'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  de: 'Deutsch',
  zh: '中文',
  hi: 'हिन्दी',
  ja: '日本語',
  ru: 'Русский',
};

const LOCALE_FLAGS: Record<string, string> = {
  en: '🇬🇧', ar: '🇸🇦', es: '🇪🇸', fr: '🇫🇷',
  pt: '🇧🇷', de: '🇩🇪', zh: '🇨🇳', hi: '🇮🇳',
  ja: '🇯🇵', ru: '🇷🇺',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.push(newPath);
    router.refresh();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
        aria-label="Switch language"
      >
        <Globe size={15} />
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden">{LOCALE_FLAGS[locale]}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-1 w-44 bg-surface border border-border rounded-xl shadow-lg py-1 z-50">
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full text-start px-3 py-2 text-sm flex items-center gap-2 hover:bg-primary-light transition-colors ${
                l === locale ? 'text-primary font-medium bg-primary-light' : 'text-text-primary'
              }`}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
