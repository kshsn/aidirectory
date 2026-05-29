import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { PricingType } from '@prisma/client';

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default async function NewToolPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });

  async function createTool(fd: FormData) {
    'use server';
    const name = fd.get('name') as string;
    const slug = (fd.get('slug') as string) || slugify(name);
    const description = fd.get('description') as string;
    const websiteUrl = fd.get('websiteUrl') as string;
    const affiliateUrl = (fd.get('affiliateUrl') as string) || null;
    const logoUrl = (fd.get('logoUrl') as string) || null;
    const categoryId = fd.get('categoryId') as string;
    const pricingType = fd.get('pricingType') as PricingType;
    const tagsRaw = (fd.get('tags') as string) || '';
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
    const isFeatured = fd.get('isFeatured') === 'on';
    const isPublished = fd.get('isPublished') === 'on';

    const tool = await prisma.tool.create({
      data: {
        name, slug, websiteUrl,
        affiliateUrl: affiliateUrl && affiliateUrl.startsWith('https://') ? affiliateUrl : null,
        logoUrl: logoUrl && logoUrl.startsWith('https://') ? logoUrl : null,
        categoryId, pricingType, tags, isFeatured, isPublished, isVerified: true,
      },
    });

    await prisma.toolTranslation.create({
      data: { toolId: tool.id, locale: 'en', description, shortDescription: description.slice(0, 160) },
    });

    revalidateTag('tools');
    redirect('/admin/tools');
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Add New Tool</h1>
      <form action={createTool} className="space-y-4 bg-surface border border-border rounded-xl p-6">
        <Field label="Tool Name *" name="name" required placeholder="e.g. Midjourney" />
        <Field label="Slug (auto-generated if empty)" name="slug" placeholder="e.g. midjourney" />
        <Field label="Website URL *" name="websiteUrl" required type="url" placeholder="https://..." />
        <Field label="Affiliate URL" name="affiliateUrl" type="url" placeholder="https://...?ref=aidirectory" />
        <Field label="Logo URL" name="logoUrl" type="url" placeholder="https://...favicon.ico" />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Category *</label>
          <select name="categoryId" required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.slug}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Pricing *</label>
          <select name="pricingType" required className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none">
            {(['FREE', 'FREEMIUM', 'PAID', 'OPEN_SOURCE'] as const).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <Field label="Tags (comma-separated)" name="tags" placeholder="ai, writing, gpt" />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Description (English) *</label>
          <textarea name="description" required rows={4} className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none resize-none" />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isFeatured" className="rounded" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isPublished" defaultChecked className="rounded" /> Published
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Create Tool
          </button>
          <a href="/admin/tools" className="px-5 py-2.5 border border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, required, type = 'text', placeholder }: {
  label: string; name: string; required?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}
