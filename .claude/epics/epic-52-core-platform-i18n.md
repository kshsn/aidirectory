# Epic 1: Core Platform & i18n
**Jira Key:** SCRUM-52  
**Priority:** Highest | **Sprint:** 1 | **Points:** 24

## Goal
Establish the foundational Next.js 15 application with TypeScript, Tailwind CSS, PostgreSQL/Prisma, next-intl locale routing for 10 languages, IP geolocation language detection, and RTL support for Arabic.

## Stories

| Story | Jira Key | Points | Status |
|-------|----------|--------|--------|
| Next.js 15 + TypeScript + Tailwind scaffold | SCRUM-58 | 5 | To Do |
| PostgreSQL + Prisma + core schema | SCRUM-59 | 3 | To Do |
| next-intl 10-locale routing | SCRUM-60 | 8 | To Do |
| IP geolocation language detection | SCRUM-61 | 5 | To Do |
| RTL layout support for Arabic | SCRUM-62 | 3 | To Do |

## Definition of Done
- App runs on localhost:3000 with no TypeScript errors
- All 10 locales accessible at /{locale}/ with correct language
- Arabic locale displays RTL layout
- First-time visitor is auto-redirected to their country's locale
- All Prisma tables created and verified with prisma migrate dev
