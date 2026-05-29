import { prisma } from './prisma';
import { PricingType } from '@prisma/client';

const TOOLS_PER_PAGE = 24;

export type ToolWithTranslation = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string;
  affiliateUrl: string | null;
  logoUrl: string | null;
  pricingType: PricingType;
  tags: string[];
  isFeatured: boolean;
  clickCount: number;
  createdAt: Date;
  category: { slug: string; translations: { name: string }[] };
  translations: { description: string; shortDescription: string | null }[];
};

export async function getTools({
  locale = 'en',
  categorySlug,
  pricingType,
  sort = 'newest',
  page = 1,
  limit = TOOLS_PER_PAGE,
  search,
}: {
  locale?: string;
  categorySlug?: string;
  pricingType?: PricingType;
  sort?: 'newest' | 'popular';
  page?: number;
  limit?: number;
  search?: string;
}) {
  const where = {
    isPublished: true,
    isDeleted: false,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(pricingType && { pricingType }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { tags: { has: search.toLowerCase() } },
        { translations: { some: { locale: 'en', description: { contains: search, mode: 'insensitive' as const } } } },
      ],
    }),
  };

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      include: {
        category: { include: { translations: { where: { locale } } } },
        translations: { where: { locale } },
      },
      orderBy: sort === 'popular' ? { clickCount: 'desc' } : { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.tool.count({ where }),
  ]);

  return { tools, total, pages: Math.ceil(total / limit) };
}

export async function getToolBySlug(slug: string, locale = 'en') {
  return prisma.tool.findFirst({
    where: { slug, isPublished: true, isDeleted: false },
    include: {
      category: { include: { translations: { where: { locale } } } },
      translations: { where: { locale } },
    },
  });
}

export async function getFeaturedTools(locale = 'en', limit = 6) {
  const tools = await prisma.tool.findMany({
    where: { isPublished: true, isDeleted: false, isFeatured: true },
    include: {
      category: { include: { translations: { where: { locale } } } },
      translations: { where: { locale } },
    },
    orderBy: { clickCount: 'desc' },
    take: limit,
  });
  if (tools.length === 0) {
    return prisma.tool.findMany({
      where: { isPublished: true, isDeleted: false },
      include: {
        category: { include: { translations: { where: { locale } } } },
        translations: { where: { locale } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
  return tools;
}

export async function getTrendingTools(locale = 'en', limit = 8) {
  return prisma.tool.findMany({
    where: { isPublished: true, isDeleted: false },
    include: {
      category: { include: { translations: { where: { locale } } } },
      translations: { where: { locale } },
    },
    orderBy: { clickCount: 'desc' },
    take: limit,
  });
}

export async function getNewestTools(locale = 'en', limit = 8) {
  return prisma.tool.findMany({
    where: { isPublished: true, isDeleted: false },
    include: {
      category: { include: { translations: { where: { locale } } } },
      translations: { where: { locale } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getRelatedTools(categoryId: string, excludeId: string, locale = 'en', limit = 4) {
  return prisma.tool.findMany({
    where: { isPublished: true, isDeleted: false, categoryId, id: { not: excludeId } },
    include: {
      category: { include: { translations: { where: { locale } } } },
      translations: { where: { locale } },
    },
    orderBy: { clickCount: 'desc' },
    take: limit,
  });
}

export async function getCategories(locale = 'en') {
  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale } },
      _count: { select: { tools: { where: { isPublished: true, isDeleted: false } } } },
    },
    orderBy: { sortOrder: 'asc' },
  });
  return categories;
}

export async function getCategoryBySlug(slug: string, locale = 'en') {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      _count: { select: { tools: { where: { isPublished: true, isDeleted: false } } } },
    },
  });
}

export async function getTotalToolCount() {
  return prisma.tool.count({ where: { isPublished: true, isDeleted: false } });
}
