# Epic 5: Monetization Layer
**Jira Key:** SCRUM-56  
**Priority:** High | **Sprint:** 2–3 | **Points:** 8

## Goal
Integrate Google AdSense with strategic ad placements and build an affiliate click analytics dashboard so revenue can be tracked and optimized.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| Google AdSense integration + ad slots | SCRUM-73 | 3 | To Do |
| Affiliate click analytics dashboard | SCRUM-74 | 5 | To Do |

## Definition of Done
- AdSense renders on homepage, category pages, and tool detail pages without CLS
- Ad slots fail gracefully when blocked by ad-blockers
- /admin/analytics shows top 10 tools by affiliate clicks with 7d/30d breakdown
- Analytics queries use indexed columns, no full table scans
