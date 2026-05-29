import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingType } from '@prisma/client';
import ToolCard from '@/components/tools/ToolCard';
import AdSlot from '@/components/ads/AdSlot';
import { getCategoryBySlug, getTools } from '@/lib/tools';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string; pricing?: string; sort?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategoryBySlug(slug, locale);
  if (!category) return {};
  const name = category.translations[0]?.name || slug;
  return {
    title: `${name} AI Tools | aidirectory`,
    description: `Discover the best ${name} AI tools. Browse ${category._count.tools}+ tools.`,
  };
}

const PRICING_OPTIONS = [
  { value: '', label: 'All Pricing' },
  { value: 'FREE', label: 'Free' },
  { value: 'FREEMIUM', label: 'Freemium' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OPEN_SOURCE', label: 'Open Source' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
];

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { page = '1', pricing = '', sort = 'newest' } = await searchParams;
  setRequestLocale(locale);

  const [category, { tools, total, pages }] = await Promise.all([
    getCategoryBySlug(slug, locale),
    getTools({
      locale,
      categorySlug: slug,
      pricingType: pricing as PricingType | undefined,
      sort: sort as 'newest' | 'popular',
      page: parseInt(page),
    }),
  ]);

  if (!category) notFound();

  const categoryName = category.translations[0]?.name || slug;
  const currentPage = parseInt(page);

  const buildUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams({ page, pricing, sort, ...params });
    return `/${locale}/category/${slug}?${sp}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm text-text-muted mb-3">
          <Link href={`/${locale}`} className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{categoryName}</span>
        </nav>
        <h1 className="text-3xl font-bold text-text-primary mb-1">{categoryName} AI Tools</h1>
        <p className="text-text-muted">{total} tools</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {PRICING_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={buildUrl({ pricing: opt.value, page: '1' })}
            className={`px-3 py-1.5 rounded-badge text-sm border transition-colors ${
              pricing === opt.value
                ? 'bg-primary text-white border-primary'
                : 'bg-surface border-border text-text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {opt.label}
          </Link>
        ))}
        <div className="ms-auto">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={buildUrl({ sort: opt.value, page: '1' })}
              className={`ms-2 px-3 py-1.5 rounded-badge text-sm border transition-colors ${
                sort === opt.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {tools.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-4xl mb-4">🤖</p>
          <p className="text-lg font-medium">No tools found</p>
          <p className="text-sm mt-1">Try changing the filters above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <>
                <ToolCard key={tool.id} tool={tool} locale={locale} />
                {(i + 1) % 12 === 0 && i < tools.length - 1 && (
                  <div key={`ad-${i}`} className="col-span-full">
                    <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY || ''} format="horizontal" />
                  </div>
                )}
              </>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {currentPage > 1 && (
                <Link href={buildUrl({ page: String(currentPage - 1) })} className="px-4 py-2 rounded-lg border border-border text-text-muted hover:border-primary hover:text-primary transition-colors text-sm">
                  ← Previous
                </Link>
              )}
              {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <Link
                    key={p}
                    href={buildUrl({ page: String(p) })}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      p === currentPage
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-text-muted hover:border-primary hover:text-primary'
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
              {currentPage < pages && (
                <Link href={buildUrl({ page: String(currentPage + 1) })} className="px-4 py-2 rounded-lg border border-border text-text-muted hover:border-primary hover:text-primary transition-colors text-sm">
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
