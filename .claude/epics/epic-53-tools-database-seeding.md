# Epic 2: Tools Database & Seeding
**Jira Key:** SCRUM-53  
**Priority:** Highest | **Sprint:** 1 | **Points:** 19

## Goal
Design and implement the complete AI tools database schema, seed 500+ tools from a curated JSON source, and run AI translation (GPT-4o) to generate descriptions in all 9 non-English languages at seed time.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| CSV/JSON seed pipeline for 500+ tools | SCRUM-63 | 8 | To Do |
| AI translation pipeline (9 languages) | SCRUM-64 | 8 | To Do |
| 10 categories with icons + translations | SCRUM-65 | 3 | To Do |

## Definition of Done
- 500+ tools in database with name, slug, URL, affiliate URL, logo, category, pricing, tags, English description
- 9 translation records per tool in tool_translations table
- 10 categories seeded with translated names and Lucide icons
- Seed scripts are idempotent (safe to re-run)
