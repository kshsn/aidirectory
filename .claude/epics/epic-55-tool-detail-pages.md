# Epic 4: Tool Detail Pages
**Jira Key:** SCRUM-55  
**Priority:** High | **Sprint:** 2 | **Points:** 14

## Goal
Build individual tool pages at /{locale}/tools/{slug} with full SEO (JSON-LD, OG tags, hreflang), translated descriptions, affiliate CTA button, and click tracking redirect.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| Tool detail page layout + CTA | SCRUM-70 | 8 | To Do |
| JSON-LD + OG/Twitter meta tags | SCRUM-71 | 3 | To Do |
| Affiliate click redirect API | SCRUM-72 | 3 | To Do |

## Definition of Done
- Tool pages render in all 10 locales with translated description
- SoftwareApplication JSON-LD passes Google Rich Results Test
- CTA button passes through /api/redirect/[toolId] and logs click to DB
- 404 returned for invalid slugs
- hreflang tags present for all 10 locales on every tool page
