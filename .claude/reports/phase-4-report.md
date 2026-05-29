# Phase 4 Report — GitHub Repo + Tech Stack
**Project:** aidirectory  
**Date:** 2026-05-29  
**Status:** COMPLETE

---

## GitHub Repo
**URL:** https://github.com/kshsn/aidirectory  
**Visibility:** Public  
**Default Branch:** main  
**Branch Protection:** Enabled (PR required, review required)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 15.x |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 4.x |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 6.x |
| i18n | next-intl | 3.x |
| Auth | NextAuth.js (Auth.js) | 5.x beta |
| Runtime | Node.js | 20.x LTS |

---

## What Was Scaffolded

- [x] Next.js 15 App Router with TypeScript + Tailwind CSS
- [x] Prisma schema (tools, categories, translations, affiliate_clicks)
- [x] Prisma client singleton at `src/lib/prisma.ts`
- [x] next-intl routing config for 10 locales
- [x] Middleware for IP-based language detection + locale redirect
- [x] Translation files: `messages/en.json` (full) + `messages/ar.json` (full) + 8 placeholder locales
- [x] `.env.example` with all required environment variables documented
- [x] CI/CD pipeline at `.github/workflows/deploy.yml` (local — needs workflow OAuth scope to push)
- [x] GitHub environments: `staging` + `production` created
- [x] Branch protection on `main`: PR review required

---

## CI/CD Pipeline
**File:** `.github/workflows/deploy.yml`  
**Jobs:** lint → type-check → test → build → deploy-staging → (manual approval) → deploy-production  
**Status:** File exists locally. Push blocked by missing `workflow` OAuth scope.

**To push CI/CD to GitHub, run:**
```bash
gh auth refresh -s workflow --hostname github.com
git add .github/workflows/deploy.yml
git commit -m "feat: add CI/CD pipeline"
git push origin main
```

---

## Environments
- **staging:** https://github.com/kshsn/aidirectory/deployments/activity_log?environments_filter=staging
- **production:** https://github.com/kshsn/aidirectory/deployments/activity_log?environments_filter=production

---

## Note on Node.js
The system `node` symlink is broken (Node 19 with missing icu4c). Developers must use:
```bash
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
```
Or run `nvm use 20` after fixing the nvm prefix issue.
