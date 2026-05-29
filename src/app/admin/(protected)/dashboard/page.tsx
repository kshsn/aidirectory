import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getStats() {
  const [tools, categories, clicks, clicksToday] = await Promise.all([
    prisma.tool.count({ where: { isDeleted: false } }),
    prisma.category.count(),
    prisma.affiliateClick.count(),
    prisma.affiliateClick.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);
  return { tools, categories, clicks, clicksToday };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Tools', value: stats.tools.toLocaleString(), color: 'bg-primary-light text-primary' },
    { label: 'Categories', value: stats.categories, color: 'bg-free-bg text-free' },
    { label: 'All-Time Clicks', value: stats.clicks.toLocaleString(), color: 'bg-freemium-bg text-freemium' },
    { label: 'Clicks Today', value: stats.clicksToday.toLocaleString(), color: 'bg-opensource-bg text-opensource' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl p-5 ${c.color}`}>
            <p className="text-3xl font-bold mb-1">{c.value}</p>
            <p className="text-sm font-medium opacity-80">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/tools" className="block text-sm text-primary hover:underline">→ Manage Tools</Link>
            <Link href="/admin/categories" className="block text-sm text-primary hover:underline">→ Manage Categories</Link>
            <Link href="/admin/analytics" className="block text-sm text-primary hover:underline">→ View Analytics</Link>
            <a href="/en" target="_blank" rel="noreferrer" className="block text-sm text-primary hover:underline">→ View Public Site</a>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold mb-3">Setup Checklist</h2>
          <div className="space-y-2 text-sm text-text-muted">
            <p>✅ Database schema + seed</p>
            <p>✅ 10 categories with translations</p>
            <p>✅ 100 tools seeded</p>
            <p>⬜ Run <code className="bg-base px-1 rounded">npm run db:seed</code> on VPS</p>
            <p>⬜ Run <code className="bg-base px-1 rounded">npm run translate</code> (needs ANTHROPIC_API_KEY)</p>
            <p>⬜ Add AdSense publisher ID to .env</p>
          </div>
        </div>
      </div>
    </div>
  );
}
