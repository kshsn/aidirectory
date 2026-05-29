# Plan Report — aidirectory
**Date:** 2026-05-29  
**Phase:** 2

---

## Solution Overview

aidirectory is a Next.js 15 AI tools directory that auto-detects the user's country on first visit and renders the site in their native language (10 languages, including RTL Arabic). Every tool has a dedicated SEO-optimized page at `/{locale}/tools/{slug}`. The platform is monetized via Google AdSense placements and affiliate links on all tool CTAs. Content is admin-curated — no user submissions in v1. The admin panel lives at `/admin` protected by NextAuth.js credentials.

---

## Epic Breakdown

| Epic | Description | Effort | Priority |
|------|-------------|--------|----------|
| 1. Core Platform & i18n | Next.js 15 + Prisma + PostgreSQL + next-intl + IP geolocation + RTL | M | Must Have |
| 2. Tools Database & Seeding | Tool/category models, admin CRUD, seed 500+ tools with AI-translated descriptions | L | Must Have |
| 3. Browse & Search | Homepage, category pages, full-text search, filters (pricing, category), pagination | M | Must Have |
| 4. Tool Detail Pages | Tool page with logo, descriptions, screenshots, pricing, tags, affiliate CTA, JSON-LD SEO | M | Must Have |
| 5. Monetization Layer | Google AdSense script + ad slots, affiliate click tracking table + redirect API | S | Must Have |
| 6. Admin Panel | Protected Next.js admin with tool/category CRUD, image upload, publish/unpublish | M | Must Have |

**Total: 6 epics | Estimated 5–6 weeks**

---

## Architecture Overview

- **Frontend/Backend:** Next.js 15 (App Router) — SSG + ISR for tool pages
- **i18n:** next-intl with locale routing (`/ar/`, `/es/`, `/zh/`, etc.)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** NextAuth.js (credentials, single admin)
- **Language Detection:** ipapi.co free tier (IP → country → locale)
- **Hosting:** VPS with PM2 + Nginx (Phase 8)
- **Monitoring:** Sentry + PM2 logs

---

## Key Decisions

1. **SSG over SSR** for tool pages — better Core Web Vitals, cheaper hosting, massive SEO advantage
2. **next-intl** for i18n — official Next.js App Router support, locale routing built-in
3. **AI translation at seed time** — GPT-4o batch-translates tool descriptions into 9 languages during the seeding script. No runtime translation API needed.
4. **No user accounts in v1** — removes auth complexity, speeds up launch
5. **Affiliate links in DB** — every tool has a dedicated `affiliateUrl`, click is logged to `affiliate_clicks` table before redirect

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| TAAFT/Toolify SEO dominance | Target non-English keyword markets they ignore |
| 10-language content effort | AI-translate descriptions at seed time |
| AdSense approval delay | Apply at staging; affiliate links earn revenue immediately |
| Geolocation accuracy | Accept-Language header fallback + manual switcher |

---

## Out of Scope (v1)
- User accounts / profiles / reviews
- Community tool submissions
- Sponsored listing payments
- Mobile app

---

## Success Criteria (KPIs)
| KPI | Target (90 days post-launch) |
|-----|------------------------------|
| Monthly visitors | 10,000+ |
| Tools listed | 500+ launch → 1,000+ in 60 days |
| AdSense + affiliate revenue | $500+/month |
| Affiliate CTR | 5%+ on tool pages |
| Indexed pages (Google) | 500+ |
| Languages live | 10 |
