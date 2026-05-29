'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { PricingType } from '@prisma/client';
import PricingBadge from './PricingBadge';

type Props = {
  tool: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
    pricingType: PricingType;
    tags: string[];
    category: { slug: string; translations: { name: string }[] };
    translations: { description: string; shortDescription: string | null }[];
  };
  locale: string;
};

function ToolLogo({ logoUrl, name }: { logoUrl: string | null; name: string }) {
  if (logoUrl) {
    return (
      <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-border bg-surface">
        <Image
          src={logoUrl}
          alt={name}
          fill
          className="object-contain p-1"
          unoptimized
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary-light flex items-center justify-center border border-border">
      <span className="text-primary font-bold text-lg">{name[0]?.toUpperCase()}</span>
    </div>
  );
}

export default function ToolCard({ tool, locale }: Props) {
  const description = tool.translations[0]?.shortDescription || tool.translations[0]?.description || '';
  const categoryName = tool.category.translations[0]?.name || tool.category.slug;

  return (
    <div className="bg-surface border border-border rounded-card p-4 flex flex-col gap-3 hover:border-primary hover:shadow-md transition-all group">
      {/* Header */}
      <div className="flex items-start gap-3">
        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <span className="text-xs text-text-muted mt-0.5 block">{categoryName}</span>
        </div>
        <PricingBadge type={tool.pricingType} />
      </div>

      {/* Description */}
      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">
        {description}
      </p>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-base rounded text-xs text-text-muted border border-border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/api/redirect/${tool.id}?locale=${locale}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Visit Tool
        <ExternalLink size={12} />
      </Link>
    </div>
  );
}
