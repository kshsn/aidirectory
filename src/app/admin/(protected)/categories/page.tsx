import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      translations: { where: { locale: 'en' } },
      _count: { select: { tools: { where: { isPublished: true, isDeleted: false } } } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  async function updateSortOrder(fd: FormData) {
    'use server';
    for (const [key, value] of fd.entries()) {
      if (key.startsWith('order_')) {
        const id = key.replace('order_', '');
        await prisma.category.update({ where: { id }, data: { sortOrder: parseInt(value as string) } });
      }
    }
    revalidateTag('categories');
    redirect('/admin/categories');
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Categories</h1>
      <div className="bg-surface border border-border rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-base border-b border-border">
            <tr>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Category</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Slug</th>
              <th className="text-start px-4 py-3 font-medium text-text-muted">Icon</th>
              <th className="text-end px-4 py-3 font-medium text-text-muted">Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-base/50">
                <td className="px-4 py-3 font-medium text-text-primary">
                  {cat.translations[0]?.name || cat.slug}
                </td>
                <td className="px-4 py-3 text-text-muted font-mono text-xs">{cat.slug}</td>
                <td className="px-4 py-3 text-text-muted text-xs">{cat.icon}</td>
                <td className="px-4 py-3 text-end text-text-muted">{cat._count.tools}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm text-primary-dark">
        <strong>Note:</strong> Categories are seeded from <code>prisma/seed/categories.ts</code> with full 10-language translations. To add a new category, update that file and re-run <code>npm run db:seed</code>. Deletion is blocked if tools exist in the category.
      </div>
    </div>
  );
}
