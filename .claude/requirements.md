# Requirements — aidirectory
**Date:** 2026-05-29  
**Phase:** 2

---

## Problem Statement
Finding the right AI tool for a specific task is hard. ~47,400 AI tools exist and hundreds launch weekly. No major directory serves non-English users — a 3B+ person market that is completely ignored by TAAFT, Toolify, and Futurepedia.

---

## Target Users

### Primary
- Non-English-speaking internet users (Arabic, Spanish, French, Portuguese, German, Chinese, Hindi, Japanese, Russian) searching for AI tools in their native language
- English-speaking individuals (18–45) researching AI tools for productivity, creative work, and business

### Secondary
- Businesses and SMBs evaluating AI tools
- Developers researching AI APIs and frameworks

---

## Core User Flows

1. **Discovery flow:** User arrives → country detected → UI loads in local language → user browses by category or trending → clicks a tool → reads detail page → clicks affiliate CTA to visit tool
2. **Search flow:** User types a task or tool name → results shown → filtered by category/pricing/tags → user clicks tool
3. **Language switch flow:** User manually changes language from header → site re-renders in selected language, preference saved in cookie
4. **Category browse flow:** User clicks a category (e.g. "Writing", "Design") → sees all tools in that category → sorted by popularity, newest, or rating
5. **Admin flow:** Admin logs in → adds new tool (name, description, URL, affiliate link, category, tags, logo, screenshots, pricing, languages) → publishes immediately

---

## Must-Have Features (MVP)

- [ ] Homepage with hero, featured tools, categories grid, trending tools section
- [ ] AI tools database with 500+ tools at launch (seeded via script)
- [ ] Tool detail page: logo, description, screenshots, pricing, tags, affiliate CTA button
- [ ] Category pages (e.g. Writing, Image, Video, Code, Audio, Business, Research, Productivity, Education, Other)
- [ ] Search (full-text across tool name, description, tags)
- [ ] Auto-detect country language on first visit (IP geolocation → Accept-Language fallback)
- [ ] 10 languages: English (en), Arabic (ar), Spanish (es), French (fr), Portuguese (pt), German (de), Chinese Simplified (zh), Hindi (hi), Japanese (ja), Russian (ru)
- [ ] RTL layout support for Arabic
- [ ] Manual language switcher in header
- [ ] Google AdSense ad placements (homepage, category pages, tool detail pages)
- [ ] Affiliate link tracking on tool CTA buttons (UTM params + click logging)
- [ ] Admin panel: CRUD for tools and categories (protected with auth)
- [ ] SEO: sitemap.xml, robots.txt, OG tags, JSON-LD for each tool page
- [ ] Responsive / mobile-first design

---

## Should-Have Features (v1.1)

- [ ] User reviews and ratings on tool pages
- [ ] Tool comparison page (compare 2–3 tools side by side)
- [ ] Email newsletter signup (Mailchimp/Resend integration)
- [ ] "New this week" and "Trending" automated feeds
- [ ] Sponsored listings (featured placement for paying vendors)
- [ ] Pricing filter (Free, Freemium, Paid, Open Source)

---

## Out of Scope (v1)

- Community tool submissions by users (admin-only curation)
- User accounts / profiles
- Mobile app
- AI-powered recommendations
- Social sharing features

---

## Constraints

| Constraint | Value |
|-----------|-------|
| Timeline | 4–6 weeks to launch |
| Platform | Web only |
| Languages at launch | 10 (EN, AR, ES, FR, PT, DE, ZH, HI, JA, RU) |
| Content model | Admin-curated (no user submissions) |
| Monetization | Google AdSense + affiliate links |
| Budget | Not specified — lean stack, no paid APIs except IP geolocation |

---

## Success KPIs (90-day post-launch)

| KPI | Target |
|-----|--------|
| Monthly visitors | 10,000+ |
| Tools listed | 500+ at launch, 1,000+ within 60 days |
| AdSense revenue | $500+/month |
| Affiliate click-through rate | 5%+ on tool detail pages |
| Google indexed pages | 500+ |
| Bounce rate | < 60% |
| Languages active | 10 |
