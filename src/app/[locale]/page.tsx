import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Search } from 'lucide-react';
import * as Icons from 'lucide-react';
import ToolCard from '@/components/tools/ToolCard';
import AdSlot from '@/components/ads/AdSlot';
import {
  getCategories,
  getFeaturedTools,
  getTrendingTools,
  getNewestTools,
  getTotalToolCount,
} from '@/lib/tools';

type Props = { params: Promise<{ locale: string }> };

function CategoryIcon({ name }: { name: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.ComponentType<{ size?: number; className?: string }> | undefined;
  if (!Icon) return <span className="text-2xl">🤖</span>;
  return <Icon size={28} className="text-primary" />;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, featured, trending, newest, totalCount] = await Promise.all([
    getCategories(locale),
    getFeaturedTools(locale, 6),
    getTrendingTools(locale, 8),
    getNewestTools(locale, 8),
    getTotalToolCount(),
  ]);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-hero text-text-inverse py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-light text-sm font-semibold tracking-widest uppercase mb-4">
            The Global AI Tools Directory
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Find the Perfect AI Tool<br className="hidden md:block" /> for Any Task
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Discover {totalCount.toLocaleString()}+ AI tools across {categories.length} categories — updated daily.
          </p>
          <form action={`/${locale}/search`} method="GET" className="max-w-2xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                name="q"
                placeholder="Search AI tools, e.g. 'image generation'…"
                className="w-full ps-11 pe-4 py-3.5 rounded-xl text-text-primary bg-white border border-transparent outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Categories Grid ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-bold text-text-primary mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const name = cat.translations[0]?.name || cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/${locale}/category/${cat.slug}`}
                className="bg-surface border border-border rounded-card p-4 text-center hover:border-primary hover:shadow-md transition-all group flex flex-col items-center gap-2"
              >
                <CategoryIcon name={cat.icon} />
                <span className="font-medium text-text-primary text-sm group-hover:text-primary transition-colors leading-tight">
                  {name}
                </span>
                <span className="text-xs text-text-muted">{cat._count.tools} tools</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Tools ────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Featured Tools</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ── AdSense Banner ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <AdSlot
          slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOMEPAGE || ''}
          format="horizontal"
          className="w-full"
          style={{ minHeight: 90 }}
        />
      </div>

      {/* ── Trending This Week ────────────────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Trending This Week</h2>
            <Link href={`/${locale}/search?sort=popular`} className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* ── Newest Tools ─────────────────────────────────────────────────── */}
      {newest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Newest Tools</h2>
            <Link href={`/${locale}/search?sort=newest`} className="text-sm text-primary hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newest.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
