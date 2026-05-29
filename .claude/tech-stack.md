# Tech Stack — aidirectory
**Date:** 2026-05-29  
**Phase:** 4

---

## Stack Decision

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js | 15.x | App Router + SSG/ISR — optimal for SEO-heavy directory site |
| Language | TypeScript | 5.x | Type safety, strict mode, better DX |
| Styling | Tailwind CSS | 4.x | Utility-first, RTL support via `rtl:` variants, fast |
| Database | PostgreSQL | 15+ | Full-text search (`tsvector`), JSONB support, reliable |
| ORM | Prisma | 6.x | Type-safe queries, migrations, seed scripts |
| i18n | next-intl | 3.x | Official Next.js App Router i18n support, locale routing |
| Auth | NextAuth.js | 5.x (Auth.js) | Simple credentials auth for single-admin use case |
| Runtime | Node.js | 20.x LTS | Required for Next.js 15 |
| Package Mgr | npm | 10.x | Standard, CI-compatible |
| Deployment | PM2 + Nginx | latest | VPS deployment, zero-downtime restart |
| Monitoring | Sentry | latest | Error tracking in production |

---

## Key Libraries

| Purpose | Library |
|---------|---------|
| IP Geolocation | ipapi.co (free tier, 30K req/month) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Image optimization | Next.js Image component (built-in) |
| AdSense | Google AdSense script (env-based publisher ID) |
| Affiliate tracking | Custom `/api/redirect/[toolId]` endpoint |

---

## Directory Structure

```
aidirectory/
├── src/
│   ├── app/
│   │   ├── [locale]/          ← all public pages live here
│   │   │   ├── page.tsx       ← homepage
│   │   │   ├── tools/[slug]/  ← tool detail pages
│   │   │   ├── category/[slug]/ ← category pages
│   │   │   └── search/        ← search results
│   │   ├── admin/             ← protected admin panel
│   │   │   ├── login/
│   │   │   ├── tools/
│   │   │   ├── categories/
│   │   │   └── analytics/
│   │   └── api/
│   │       └── redirect/[toolId]/ ← affiliate click tracking
│   ├── components/
│   │   ├── ui/               ← reusable UI components
│   │   ├── tools/            ← tool card, tool grid
│   │   ├── layout/           ← header, footer, nav
│   │   └── ads/              ← AdSlot component
│   ├── lib/
│   │   ├── prisma.ts          ← Prisma client singleton
│   │   ├── i18n.ts            ← next-intl config
│   │   └── geo.ts             ← IP geolocation helper
│   └── middleware.ts          ← locale detection + redirect
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
│       ├── tools.json         ← 500+ AI tools data
│       └── seed-tools.ts
├── messages/                  ← next-intl translation files
│   ├── en.json
│   ├── ar.json
│   ├── es.json
│   └── ... (10 locales)
├── scripts/
│   └── translate-tools.ts     ← GPT-4o translation script
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aidirectory

# NextAuth.js
NEXTAUTH_SECRET=<random-32-char-string>
NEXTAUTH_URL=https://yourdomain.com
ADMIN_USER=admin
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX

# IP Geolocation
IPAPI_KEY=<optional-paid-key>

# OpenAI (for translation script only — not needed in production)
OPENAI_API_KEY=<key>
```
