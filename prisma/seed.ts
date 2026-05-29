import { PrismaClient, PricingType } from '@prisma/client';
import { CATEGORIES } from './seed/categories';
import toolsData from './seed/tools.json';

const prisma = new PrismaClient();

const LOCALES = ['en', 'ar', 'es', 'fr', 'pt', 'de', 'zh', 'hi', 'ja', 'ru'] as const;

async function seedCategories() {
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { icon: cat.icon, sortOrder: cat.sortOrder },
      create: { slug: cat.slug, icon: cat.icon, sortOrder: cat.sortOrder },
    });

    for (const [locale, translation] of Object.entries(cat.translations)) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: category.id, locale } },
        update: { name: translation.name, description: translation.description },
        create: {
          categoryId: category.id,
          locale,
          name: translation.name,
          description: translation.description,
        },
      });
    }
  }
  console.log(`✅ Seeded ${CATEGORIES.length} categories`);
}

async function seedTools() {
  console.log('Seeding tools...');
  let inserted = 0;
  let skipped = 0;

  for (const tool of toolsData) {
    // Find category
    const category = await prisma.category.findUnique({
      where: { slug: tool.category },
    });
    if (!category) {
      console.warn(`⚠️  Category not found: ${tool.category} for tool ${tool.name}`);
      skipped++;
      continue;
    }

    // Validate logo URL
    const logoUrl =
      tool.logoUrl && tool.logoUrl.startsWith('https://') ? tool.logoUrl : null;

    // Upsert tool
    const created = await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        websiteUrl: tool.websiteUrl,
        affiliateUrl: tool.affiliateUrl || null,
        logoUrl,
        pricingType: tool.pricingType as PricingType,
        categoryId: category.id,
        tags: tool.tags,
      },
      create: {
        slug: tool.slug,
        name: tool.name,
        websiteUrl: tool.websiteUrl,
        affiliateUrl: tool.affiliateUrl || null,
        logoUrl,
        pricingType: tool.pricingType as PricingType,
        categoryId: category.id,
        tags: tool.tags,
        isFeatured: false,
        isVerified: true,
        isPublished: true,
      },
    });

    // Seed English translation
    await prisma.toolTranslation.upsert({
      where: { toolId_locale: { toolId: created.id, locale: 'en' } },
      update: { description: tool.description },
      create: {
        toolId: created.id,
        locale: 'en',
        description: tool.description,
        shortDescription: tool.description.slice(0, 160),
      },
    });

    inserted++;
  }

  console.log(`✅ Seeded ${inserted} tools (${skipped} skipped)`);
}

async function main() {
  console.log('🌱 Starting database seed...');
  await seedCategories();
  await seedTools();
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
