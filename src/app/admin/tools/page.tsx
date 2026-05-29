import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PricingType } from '@prisma/client';
import PricingBadge from '@/components/tools/PricingBadge';
import { Plus, Pencil, Trash2 } from 'lucide-react';

async function getAdminTools(search?: string, category?: string, status?: string) {
  return prisma.tool.findMany({
    where: {
      isDeleted: false,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category: { slug: category } }),
      ...(status === 'published' && { isPublished: true }),
      ...(status === 'draft' && { isPublished: false }),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

type Props = {
  searchParams: Promise<{ search?: string; category?: string; status?: string }>;
};

export default async function AdminToolsPage({ searchParams }: Props) {
  const { search, category, status } = await searchParams;
  const [tools, categories] = await Promise.all([
    getAdminTools(search, category, status),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Tools <span className="text-text-muted font-normal text-lg">({tools.length})</span></h1>
        <Link href="/admin/tools/new" className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Plus size={15} /> Add Tool
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name…"
          className="px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 w-48"
        />
        <select name="category" defaultValue={category || ''} className="px-3 py-2 border border-border rounded-lg text-sm outline-none">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.slug}</option>)}
        </select>
        <select name="status" defaultValue={status || ''} className="px-3 py-2 border border-border rounded-lg text-sm outline-none">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Filter</button>
      </form>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-base border-b border-border">
            <tr>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Tool</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Category</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Pricing</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Clicks</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tools.map((tool) => (
              <tr key={tool.id} className="hover:bg-base/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-text-primary">{tool.name}</p>
                    <p className="text-xs text-text-muted">{tool.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{tool.category.slug}</td>
                <td className="px-4 py-3"><PricingBadge type={tool.pricingType} /></td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-badge font-medium ${tool.isPublished ? 'bg-free-bg text-free' : 'bg-border text-text-muted'}`}>
                    {tool.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">{tool.clickCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/tools/${tool.id}`} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary-light rounded transition-colors">
                      <Pencil size={14} />
                    </Link>
                    <form action={`/api/admin/tools/${tool.id}`} method="DELETE">
                      <button type="submit" className="p-1.5 text-text-muted hover:text-paid hover:bg-paid-bg rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tools.length === 0 && (
          <div className="text-center py-12 text-text-muted">No tools found.</div>
        )}
      </div>
    </div>
  );
}
