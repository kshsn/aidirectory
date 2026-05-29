# Epic 6: Admin Panel
**Jira Key:** SCRUM-57  
**Priority:** High | **Sprint:** 3 | **Points:** 16

## Goal
Build a secure admin panel at /admin/* for managing tools, categories, and viewing analytics. Protected by NextAuth.js credentials. Includes sitemap.xml generation and ISR revalidation on content changes.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| Admin authentication (NextAuth.js) | SCRUM-75 | 3 | To Do |
| Admin tools CRUD interface | SCRUM-76 | 8 | To Do |
| Admin categories + sitemap.xml | SCRUM-77 | 5 | To Do |

## Definition of Done
- /admin/* routes redirect to /admin/login when unauthenticated
- Admin can create/edit/soft-delete tools and categories
- Tool changes trigger ISR revalidation immediately
- sitemap.xml includes all tool + category pages × 10 locales
- robots.txt points to sitemap.xml
