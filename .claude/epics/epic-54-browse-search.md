# Epic 3: Browse & Search
**Jira Key:** SCRUM-54  
**Priority:** High | **Sprint:** 2 | **Points:** 21

## Goal
Build the full public-facing browsing experience: homepage with hero + featured + categories + trending, category listing pages with pagination, full-text PostgreSQL search, and pricing/category/sort filters.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| Homepage (hero, featured, categories, trending) | SCRUM-66 | 8 | To Do |
| Category listing pages with pagination | SCRUM-67 | 5 | To Do |
| Full-text search | SCRUM-68 | 5 | To Do |
| Filters (pricing, category, sort) | SCRUM-69 | 3 | To Do |

## Definition of Done
- Homepage renders correctly in all 10 locales including RTL Arabic
- Category pages show paginated tools with ?page= URL params
- Search returns ranked results, sanitizes input, has no-results state
- Filters persist in URL params and survive page refresh
