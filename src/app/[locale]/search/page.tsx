import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PricingType } from '@prisma/client';
import ToolCard from '@/components/tools/ToolCard';
import { getTools } from '@/lib/tools';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string; pricing?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — AI Tool Search | aidirectory` : 'Search AI Tools | aidirectory',
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q = '', page = '1', pricing = '', sort = 'newest' } = await searchParams;
  setRequestLocale(locale);

  const sanitized = q.replace(/[%_\\]/g, '\\$&').trim().slice(0, 100);

  const { tools, total, pages } = sanitized
    ? await getTools({
        locale,
        search: sanitized,
        pricingType: pricing as PricingType | undefined,
        sort: sort as 'newest' | 'popular',
        page: parseInt(page),
      })
    : { tools: [], total: 0, pages: 0 };

  const currentPage = parseInt(page);
  const buildUrl = (p: Record<string, string>) => {
    const sp = new URLSearchParams({ q, page, pricing, sort, ...p });
    return `/${locale}/search?${sp}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search bar */}
      <form action={`/${locale}/search`} method="GET" className="max-w-2xl mb-8 flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search AI tools…"
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          />
        </div>
        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          Search
        </button>
      </form>

      {!sanitized ? (
        <p className="text-text-muted text-sm">Enter a keyword to search for AI tools.</p>
      ) : total === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-medium text-text-primary">No tools found for &quot;{q}&quot;</p>
          <p className="text-sm text-text-muted mt-1">Try a different keyword or <Link href={`/${locale}`} className="text-primary hover:underline">browse categories</Link>.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-muted mb-6">
            {total} results for <strong className="text-text-primary">&quot;{q}&quot;</strong>
          </p>

          {/* Sort filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['newest', 'popular'] as const).map((s) => (
              <Link
                key={s}
                href={buildUrl({ sort: s, page: '1' })}
                className={`px-3 py-1 rounded-badge text-xs border transition-colors ${
                  sort === s ? 'bg-primary text-white border-primary' : 'border-border text-text-muted hover:border-primary hover:text-primary'
                }`}
              >
                {s === 'newest' ? 'Newest' : 'Most Popular'}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link href={buildUrl({ page: String(currentPage - 1) })} className="px-4 py-2 rounded-lg border border-border text-sm text-text-muted hover:border-primary hover:text-primary transition-colors">
                  ← Previous
                </Link>
              )}
              {currentPage < pages && (
                <Link href={buildUrl({ page: String(currentPage + 1) })} className="px-4 py-2 rounded-lg border border-border text-sm text-text-muted hover:border-primary hover:text-primary transition-colors">
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
