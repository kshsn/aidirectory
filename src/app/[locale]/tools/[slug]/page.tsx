import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Tag } from 'lucide-react';
import PricingBadge from '@/components/tools/PricingBadge';
import ToolCard from '@/components/tools/ToolCard';
import AdSlot from '@/components/ads/AdSlot';
import { getToolBySlug, getRelatedTools } from '@/lib/tools';
import { routing } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = await getToolBySlug(slug, locale);
  if (!tool) return {};
  const description = tool.translations[0]?.shortDescription || tool.translations[0]?.description?.slice(0, 160) || '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: `${tool.name} — AI Tool | aidirectory`,
    description,
    openGraph: {
      title: `${tool.name} | aidirectory`,
      description,
      images: tool.logoUrl ? [{ url: tool.logoUrl, width: 200, height: 200 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | aidirectory`,
      description,
      images: tool.logoUrl ? [tool.logoUrl] : [],
    },
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${appUrl}/${l}/tools/${slug}`])
      ),
      canonical: `${appUrl}/${locale}/tools/${slug}`,
    },
  };
}

function JsonLd({ tool, locale }: { tool: NonNullable<Awaited<ReturnType<typeof getToolBySlug>>>; locale: string }) {
  const description = tool.translations[0]?.description || '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description,
    url: tool.websiteUrl,
    applicationCategory: 'WebApplication',
    offers: {
      '@type': 'Offer',
      price: tool.pricingType === 'FREE' ? '0' : undefined,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
    },
    image: tool.logoUrl || undefined,
    sameAs: [tool.websiteUrl],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ToolDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tool = await getToolBySlug(slug, locale);
  if (!tool) notFound();

  const related = await getRelatedTools(tool.categoryId, tool.id, locale);
  const description = tool.translations[0]?.description || '';
  const categoryName = tool.category.translations[0]?.name || tool.category.slug;

  const ctaUrl = `/api/redirect/${tool.id}?locale=${locale}`;

  return (
    <>
      <JsonLd tool={tool} locale={locale} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-muted mb-6">
          <Link href={`/${locale}`} className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/category/${tool.category.slug}`} className="hover:text-primary">{categoryName}</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{tool.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tool header */}
            <div className="bg-surface border border-border rounded-card p-6">
              <div className="flex items-start gap-4 mb-5">
                {tool.logoUrl ? (
                  <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-border bg-base">
                    <Image src={tool.logoUrl} alt={tool.name} fill className="object-contain p-1.5" unoptimized />
                  </div>
                ) : (
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-primary-light flex items-center justify-center border border-border">
                    <span className="text-primary font-bold text-2xl">{tool.name[0]}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-text-primary mb-1">{tool.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/${locale}/category/${tool.category.slug}`} className="text-sm text-text-muted hover:text-primary transition-colors">
                      {categoryName}
                    </Link>
                    <PricingBadge type={tool.pricingType} />
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-base"
              >
                Visit {tool.name}
                <ExternalLink size={16} />
              </a>
            </div>

            {/* Description */}
            <div className="bg-surface border border-border rounded-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-3">About {tool.name}</h2>
              <p className="text-text-muted leading-relaxed text-sm">{description}</p>
            </div>

            {/* Tags */}
            {tool.tags.length > 0 && (
              <div className="bg-surface border border-border rounded-card p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Tag size={16} /> Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${locale}/search?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-base border border-border rounded-badge text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related tools */}
            {related.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-4">Related Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((t) => (
                    <ToolCard key={t.id} tool={t} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool details card */}
            <div className="bg-surface border border-border rounded-card p-5">
              <h3 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wide">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Pricing</dt>
                  <dd><PricingBadge type={tool.pricingType} /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Category</dt>
                  <dd className="text-text-primary font-medium">{categoryName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Website</dt>
                  <dd>
                    <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate max-w-[120px] block">
                      {tool.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </dd>
                </div>
              </dl>
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-5 flex items-center justify-center gap-1.5 w-full py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Visit Tool <ExternalLink size={13} />
              </a>
            </div>

            {/* AdSense sidebar */}
            <AdSlot
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL_SIDEBAR || ''}
              format="rectangle"
              style={{ minHeight: 250 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
