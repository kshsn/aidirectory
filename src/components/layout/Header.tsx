'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Search, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const locale = useLocale();

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="font-bold text-text-primary text-lg hidden sm:block">aidirectory</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors">Home</Link>
          <Link href={`/${locale}/categories`} className="hover:text-primary transition-colors">Categories</Link>
          <Link href={`/${locale}/search`} className="hover:text-primary transition-colors">Search</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/search`}
            className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
