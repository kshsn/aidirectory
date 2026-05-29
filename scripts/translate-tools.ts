/**
 * AI Translation Pipeline — SCRUM-64
 * Batch-translates English tool descriptions into 9 languages using the Claude API.
 * Run: npx tsx scripts/translate-tools.ts
 * Requires: ANTHROPIC_API_KEY in .env
 */
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_LOCALES = ['ar', 'es', 'fr', 'pt', 'de', 'zh', 'hi', 'ja', 'ru'] as const;

const LOCALE_NAMES: Record<string, string> = {
  ar: 'Arabic',
  es: 'Spanish',
  fr: 'French',
  pt: 'Portuguese',
  de: 'German',
  zh: 'Simplified Chinese',
  hi: 'Hindi',
  ja: 'Japanese',
  ru: 'Russian',
};

async function translateBatch(
  client: Anthropic,
  tools: { id: string; name: string; description: string }[],
  locale: string
): Promise<Map<string, { description: string; shortDescription: string }>> {
  const language = LOCALE_NAMES[locale];
  const toolList = tools.map((t, i) => `[${i}] ${t.name}: ${t.description}`).join('\n\n');

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `Translate the following AI tool descriptions to ${language}. Keep brand names (ChatGPT, OpenAI, etc.) in English. Return ONLY a JSON array with objects having "description" (full translation) and "shortDescription" (first 160 chars of translation, suitable for meta description). Maintain the same index order.

${toolList}

Return format: [{"description": "...", "shortDescription": "..."}, ...]`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error(`No JSON array found in response for locale ${locale}`);

  const translations: { description: string; shortDescription: string }[] = JSON.parse(jsonMatch[0]);
  const result = new Map<string, { description: string; shortDescription: string }>();
  tools.forEach((tool, i) => {
    if (translations[i]) result.set(tool.id, translations[i]);
  });
  return result;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set in .env');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Get all tools with English descriptions
  const tools = await prisma.tool.findMany({
    where: { isPublished: true },
    include: { translations: { where: { locale: 'en' } } },
  });

  const toolsWithEn = tools
    .filter((t) => t.translations[0]?.description)
    .map((t) => ({
      id: t.id,
      name: t.name,
      description: t.translations[0].description,
    }));

  console.log(`📚 Translating ${toolsWithEn.length} tools into ${TARGET_LOCALES.length} languages...`);

  let totalCreated = 0;
  let totalSkipped = 0;

  for (const locale of TARGET_LOCALES) {
    console.log(`\n🌍 Processing locale: ${LOCALE_NAMES[locale]} (${locale})`);

    // Find tools that don't have this locale yet
    const existing = await prisma.toolTranslation.findMany({
      where: { locale, toolId: { in: toolsWithEn.map((t) => t.id) } },
      select: { toolId: true },
    });
    const existingIds = new Set(existing.map((e) => e.toolId));
    const toTranslate = toolsWithEn.filter((t) => !existingIds.has(t.id));

    if (toTranslate.length === 0) {
      console.log(`  ⏭  All ${toolsWithEn.length} tools already translated — skipping`);
      totalSkipped += toolsWithEn.length;
      continue;
    }

    console.log(`  📝 Translating ${toTranslate.length} tools (${existingIds.size} already done)...`);

    // Batch in groups of 20
    const BATCH_SIZE = 20;
    for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
      const batch = toTranslate.slice(i, i + BATCH_SIZE);
      process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(toTranslate.length / BATCH_SIZE)}...`);

      try {
        const translations = await translateBatch(client, batch, locale);

        for (const [toolId, trans] of translations) {
          await prisma.toolTranslation.create({
            data: {
              toolId,
              locale,
              description: trans.description,
              shortDescription: trans.shortDescription,
            },
          });
          totalCreated++;
        }
        console.log(' ✅');
      } catch (err) {
        console.log(` ❌ Error: ${err}`);
      }

      // Small delay to avoid rate limits
      if (i + BATCH_SIZE < toTranslate.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  console.log(`\n🎉 Translation complete!`);
  console.log(`  Created: ${totalCreated} translations`);
  console.log(`  Skipped: ${totalSkipped} (already existed)`);
}

main()
  .catch((e) => { console.error('❌ Translation failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
