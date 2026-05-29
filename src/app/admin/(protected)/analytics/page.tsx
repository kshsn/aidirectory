import { prisma } from '@/lib/prisma';

const LOCALES = ['en', 'ar', 'es', 'fr', 'pt', 'de', 'zh', 'hi', 'ja', 'ru'];

async function getAnalytics(days: number) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [topTools, byLocale, totals] = await Promise.all([
    prisma.$queryRaw<{ toolId: string; name: string; count: bigint }[]>`
      SELECT ac."toolId", t.name, COUNT(*) as count
      FROM affiliate_clicks ac
      JOIN tools t ON t.id = ac."toolId"
      WHERE ac."createdAt" >= ${since}
      GROUP BY ac."toolId", t.name
      ORDER BY count DESC
      LIMIT 10
    `,
    prisma.$queryRaw<{ locale: string; count: bigint }[]>`
      SELECT locale, COUNT(*) as count
      FROM affiliate_clicks
      WHERE "createdAt" >= ${since}
      GROUP BY locale
      ORDER BY count DESC
    `,
    prisma.affiliateClick.count({ where: { createdAt: { gte: since } } }),
  ]);

  return { topTools, byLocale, totals };
}

type Props = { searchParams: Promise<{ days?: string }> };

export default async function AnalyticsPage({ searchParams }: Props) {
  const { days: daysParam = '7' } = await searchParams;
  const days = parseInt(daysParam) || 7;
  const { topTools, byLocale, totals } = await getAnalytics(days);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <a key={d} href={`?days=${d}`}
              className={`px-3 py-1.5 rounded-badge text-sm border transition-colors ${days === d ? 'bg-primary text-white border-primary' : 'border-border text-text-muted hover:border-primary hover:text-primary'}`}>
              {d}d
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tools */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-text-primary mb-4">Top Tools by Affiliate Clicks (Last {days} days)</h2>
          {topTools.length === 0 ? (
            <p className="text-text-muted text-sm py-4 text-center">No clicks recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted border-b border-border">
                  <th className="text-start py-2 font-medium">#</th>
                  <th className="text-start py-2 font-medium">Tool</th>
                  <th className="text-end py-2 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topTools.map((row, i) => (
                  <tr key={row.toolId}>
                    <td className="py-2 text-text-muted">{i + 1}</td>
                    <td className="py-2 font-medium text-text-primary">{row.name}</td>
                    <td className="py-2 text-end text-primary font-semibold">{Number(row.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* By Locale */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-text-primary mb-4">Clicks by Language</h2>
          <div className="space-y-2">
            {LOCALES.map((locale) => {
              const row = byLocale.find((r) => r.locale === locale);
              const count = row ? Number(row.count) : 0;
              const pct = totals > 0 ? Math.round((count / totals) * 100) : 0;
              return (
                <div key={locale} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8 text-text-muted uppercase">{locale}</span>
                  <div className="flex-1 bg-base rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-text-muted w-12 text-end">{count}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-text-muted mt-4 pt-3 border-t border-border">
            Total: <strong>{totals.toLocaleString()}</strong> clicks in last {days} days
          </p>
        </div>
      </div>
    </div>
  );
}
