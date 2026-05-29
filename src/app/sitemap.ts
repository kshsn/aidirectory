import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { routing } from '@/i18n/routing';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://aidirectory.com';
const LOCALES = routing.locales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, categories] = await Promise.all([
    prisma.tool.findMany({
      where: { isPublished: true, isDeleted: false },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  // Homepages (10 locales)
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE}/${locale}`,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Category pages (10 locales × N categories)
  for (const cat of categories) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/category/${cat.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Tool pages (10 locales × N tools)
  for (const tool of tools) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE}/${locale}/tools/${tool.slug}`,
        lastModified: tool.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
