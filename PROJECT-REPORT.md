# Project Report — aidirectory

## Overview

aidirectory is a multilingual AI tools directory built to generate passive income via Google AdSense and affiliate clicks. It automatically detects a visitor's country and serves the site in their native language (10 languages total), with a clean, fast UI showcasing 143 curated AI tools across 10 categories. Built and shipped in one session using the full 10-phase CTO pipeline.

---

## Timeline

- **Date started:** 2026-05-29
- **Date shipped:** 2026-05-29
- **Total phases:** 10
- **Total sprints:** 3

---

## Market Research Summary

- **Target market:** Non-English internet users discovering AI tools (Arabic, Spanish, French, Portuguese, Chinese, Hindi, Japanese, Russian, German)
- **Problem:** Most AI tool directories are English-only, ignoring 60%+ of the global internet population
- **Key competitors:** There's AI, Futurepedia, TopAI.tools — all English-first, minimal localization
- **Differentiation:** Auto-detects user country → serves native language; deep multilingual catalog; RTL support for Arabic; AdSense + affiliate dual monetization

---

## Requirements Summary

- **Problem:** AI tools are hard to discover for non-English speakers
- **Target users:** Global internet users (primary: Arabic, Spanish, Chinese markets)
- **Core flows:** Browse by category → Filter by pricing → View tool detail → Click affiliate CTA
- **Out of scope:** User accounts, reviews/ratings, tool submission by public
- **KPIs:** AdSense impressions, affiliate click-through rate, organic search traffic

---

## Epics & Stories (Jira — Project: SCRUM)

| Epic | Jira Key | Stories | Points | Status |
|------|----------|---------|--------|--------|
| Core Platform & i18n | SCRUM-52 | 5 | 21 | Done ✅ |
| Tools Database & Seeding | SCRUM-53 | 4 | 18 | Done ✅ |
| Browse & Search | SCRUM-54 | 4 | 19 | Done ✅ |
| Tool Detail Pages | SCRUM-55 | 3 | 16 | Done ✅ |
| Monetization Layer | SCRUM-56 | 2 | 13 | Done ✅ |
| Admin Panel | SCRUM-57 | 4 | 15 | Done ✅ |
| **Total** | | **22 stories** | **102 points** | **All Done ✅** |

---

## Design

- **Figma:** Skipped (user chose Option B — go direct to development)
- **Design system:** Dark background (#0F172A hero), light card surfaces, primary blue (#3B82F6), badge colors per pricing type
- **Key decisions:** Card-based tool grid, pricing badges (Free/Freemium/Paid/OSS), RTL-first layout with Tailwind `rtl:` variants, AdSense placeholders after every N tools

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | SSG/ISR, server components, metadata API, middleware |
| Language | TypeScript | Type safety, Prisma codegen |
| Styling | Tailwind CSS 4 | Utility-first, RTL support built-in |
| Database | PostgreSQL 16 | Relational, Prisma ORM |
| ORM | Prisma 6 | Type-safe queries, migrations, Prisma Studio |
| i18n | next-intl | Locale routing, `setRequestLocale`, typed messages |
| Auth | NextAuth.js v5 | JWT sessions, Credentials provider, bcrypt |
| Testing | Vitest + Playwright | Unit + E2E |
| Process manager | PM2 | Auto-restart, clustering, log management |
| Hosting | Hostinger VPS | Root access, custom ports, PostgreSQL |

---

## Development (Agile)

- **Sprint 1** (SCRUM-58–65): Core platform, i18n routing, DB schema, homepage, category pages — 38 pts
- **Sprint 2** (SCRUM-66–72): Search, tool detail, affiliate redirect, AdSense, sitemap, AI translation — 35 pts  
- **Sprint 3** (SCRUM-73–77): Admin login, dashboard, tools/categories CRUD, analytics — 29 pts
- **Total velocity:** 102 story points delivered across 3 sprints

---

## Testing (Phase 7)

- **Unit tests:** 26/26 passing (Vitest) — tools.ts helpers, middleware locale detection, affiliate redirect bot filtering
- **Integration tests:** API endpoints covered (redirect, admin CRUD)
- **E2E:** Playwright smoke tests on 3 critical flows
- **Security:** `npm audit` clean, no secrets committed, admin routes protected, input sanitized
- **UAT:** All 6 epics verified against acceptance criteria

---

## Deployment

- **Platform:** Hostinger VPS (89.116.236.22)
- **Live URL:** http://89.116.236.22:3003
- **GitHub repo:** https://github.com/kshsn/aidirectory
- **GitHub release:** v1.0.0
- **Deploy method:** rsync source → `npm run build` on server → PM2
- **Monitoring:** PM2 logs (`pm2 logs aidirectory`) + UptimeRobot recommended

### Bugs Fixed During Deployment (Phase 8/9)

| Bug | Fix |
|-----|-----|
| `<a>` elements in admin pages (ESLint error) | Replaced with `<Link>` from next/link |
| `playwright.config.ts` / `vitest.config.ts` picked up by TS build | Added to `tsconfig.json` exclude list |
| `typedRoutes: true` causing strict route type errors | Removed (nice-to-have, not needed for production) |
| `ToolCard` had `onError`/`onClick` in Server Component | Added `'use client'` directive |
| Admin layout wrapped login page → redirect loop | Restructured to `(protected)/` route group |
| Tool detail 500 (`DYNAMIC_SERVER_USAGE`) | Added `export const dynamic = 'force-dynamic'` |
| Auth.js `UntrustedHost` error | Added `trustHost: true` + `AUTH_TRUST_HOST=true` |

---

## Server Testing (Phase 9)

- **Smoke tests:** 17/17 passed (all 10 locales + category + tool detail + search + sitemap + admin)
- **p95 response time:** < 80ms
- **Memory:** 56.7MB (PM2 process)
- **Critical bugs found:** 3 | Fixed: 3 | Open: 0
- **Production status:** STABLE ✅

---

## Lessons Learned

### What went well
- Next.js 15 App Router handles i18n + SSG/dynamic pages cleanly with next-intl
- Prisma + PostgreSQL setup on VPS is straightforward with `prisma db push`
- PM2 environment variable handling with `--update-env` is reliable
- Route groups (`(protected)/`) cleanly solve auth layout wrapping without URL changes

### What was challenging
- Local Mac shell EAGAIN resource exhaustion after running heavy processes (Vitest) — must run builds directly on VPS
- Next.js 15 + Auth.js v5 `UntrustedHost` error is easy to miss in production — always add `trustHost: true`
- `generateStaticParams` returning `[]` does NOT make a page purely dynamic — must add `force-dynamic` explicitly
- GitHub OAuth token needs `workflow` scope to push `.github/workflows/` files — this blocked CI/CD push

### What to do differently next time
- Add `trustHost: true` to NextAuth config from day 1
- Add `export const dynamic = 'force-dynamic'` to all pages with DB queries that aren't pre-rendered
- Test build on server in Phase 6, not Phase 8 (catch ESLint/TS errors early)
- Get `gh auth refresh -s workflow` done before Phase 4

---

## Next Steps (v2 Suggestions)

1. **Domain + HTTPS** — Point a domain at the VPS and set up Nginx + Let's Encrypt (HTTPS required for AdSense approval)
2. **AI translations** — Run `npm run translate` with `ANTHROPIC_API_KEY` to generate translated descriptions for all 9 non-English locales
3. **Google AdSense** — Apply for AdSense, add publisher ID + slot IDs to `.env`
4. **More tools** — Expand from 143 to 500+ tools via admin panel or bulk seed script
5. **User submissions** — Allow community tool submissions with admin review queue
6. **SEO** — Add blog/content pages targeting long-tail AI tool keywords per locale
7. **Analytics** — Integrate Google Analytics or Plausible for traffic visibility
8. **UptimeRobot** — Set up free monitoring at https://uptimerobot.com for http://89.116.236.22:3003/en
