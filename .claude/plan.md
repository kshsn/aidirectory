# Plan — aidirectory
**Date:** 2026-05-29  
**Phase:** 2

---

## Solution Approach

aidirectory is a Next.js 15 web application backed by PostgreSQL. It is a content-driven directory site where every AI tool has its own SEO-optimized page. The core value prop is multilingual delivery: on first visit, the user's country is detected via IP geolocation (free tier of ipapi.co), and the UI instantly renders in their language using next-intl.

Monetization is built into the data model from day one:
- Each tool record has an `affiliateUrl` field — when a user clicks "Visit Tool", the click is logged and the user is redirected through the affiliate URL
- Google AdSense script is injected globally with strategic ad placements on high-traffic pages

The admin panel is a simple password-protected Next.js route group `/admin` that allows CRUD operations on tools and categories. No third-party CMS is needed.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Next.js 15 (App Router)             │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────┐ │
│  │  Public Site │  │  Admin Panel   │  │  API     │ │
│  │  /[lang]/    │  │  /admin/       │  │  /api/   │ │
│  └──────────────┘  └────────────────┘  └──────────┘ │
└─────────────────────────────────────────────────────┘
           │                    │
    ┌──────▼──────┐      ┌──────▼──────┐
    │  next-intl  │      │  NextAuth   │
    │  (i18n/l10n)│      │  (admin auth│
    └─────────────┘      └─────────────┘
           │
    ┌──────▼──────────────────────┐
    │        Prisma ORM           │
    └──────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │     PostgreSQL Database     │
    │  tools, categories, clicks  │
    │  translations, tags         │
    └──────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │    External Services        │
    │  ipapi.co (IP → country)    │
    │  Google AdSense             │
    │  Affiliate networks         │
    └──────────────────────────────┘
```

### Key Technical Decisions
- **Next.js 15 App Router** — SSG for tool/category pages (blazing fast, excellent SEO), ISR for updates
- **next-intl** — Battle-tested i18n for Next.js App Router with locale routing (`/ar/`, `/es/`, etc.)
- **URL structure:** `/{locale}/tools/{slug}` e.g. `/ar/tools/chatgpt` — each language creates its own indexable URL
- **IP geolocation:** `ipapi.co` free tier (30K requests/month) → detect country → map to locale → redirect
- **RTL:** Tailwind CSS `dir="rtl"` via next-intl locale config for Arabic
- **Admin auth:** NextAuth.js with credentials provider (single admin user, env-based password)
- **Database seeding:** Node.js script that reads from a curated JSON/CSV file and bulk-inserts 500+ tools

---

## Epic Breakdown

| # | Epic | Description | Effort | Priority |
|---|------|-------------|--------|----------|
| 1 | Core Platform & i18n | Next.js setup, DB schema, Prisma, next-intl, IP detection, RTL | M | Must Have |
| 2 | Tools Database & Seeding | Tool model, categories, admin CRUD, seed 500+ tools | L | Must Have |
| 3 | Browse & Search | Homepage, category pages, search, filters, pagination | M | Must Have |
| 4 | Tool Detail Pages | Individual tool pages, screenshots, affiliate CTA, SEO meta | M | Must Have |
| 5 | Monetization Layer | AdSense integration, affiliate click tracking, analytics | S | Must Have |
| 6 | Admin Panel | Protected admin UI for tool and category management | M | Must Have |

**Total estimate: 5–6 weeks at solo/small team pace**

---

## Database Schema (Core Tables)

```sql
-- tools
id, slug, name, websiteUrl, affiliateUrl, logoUrl, pricingType (enum: free/freemium/paid/opensource),
categoryId, tags[], isVerified, isFeatured, clickCount, createdAt, updatedAt

-- tool_translations
id, toolId, locale (en/ar/es/...), description, shortDescription, translatedAt

-- categories
id, slug, name, icon, sortOrder

-- category_translations
id, categoryId, locale, name, description

-- affiliate_clicks
id, toolId, locale, referrer, userAgent, ip (hashed), createdAt
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| 10-language content takes too long | Seed English first, use AI translation (GPT-4o) for other 9 languages in seeding script |
| IP geolocation accuracy | Accept-Language header as fallback; user can always switch manually |
| AdSense approval delay (2–4 weeks) | Apply for AdSense immediately after deployment; use affiliate links in the meantime |
| 500+ tools seeding effort | Build CSV-based seed script; source initial data from public AI tool lists on GitHub |
| Next.js ISR cache invalidation | Use `revalidateTag` on admin tool save; test cache behavior in staging |

---

## Out of Scope (v1)
- User accounts / profiles
- Community tool submissions
- Mobile app
- AI-powered recommendations
- Sponsored listing payment processing

---

## Success Criteria (KPIs)
- 10,000+ monthly visitors within 90 days
- 500+ tools at launch
- AdSense + affiliate generating $500+/month within 90 days
- All 10 languages working with correct RTL for Arabic
- Google Search Console: 500+ indexed pages
