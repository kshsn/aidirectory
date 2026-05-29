# Design Decisions — aidirectory

## Visual Identity
- **Style:** Clean, modern, light-mode with a dark hero section. Product Hunt meets a tech SaaS landing page.
- **Font:** Inter (all weights) — loaded via `next/font/google`
- **Arabic Font:** Cairo (RTL-optimized Google Font)
- **Icons:** Lucide React exclusively — no image icon dependencies

## Color System (Tailwind Custom Theme)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#7C3AED` | CTAs, active states, brand accent (violet) |
| `primary-light` | `#EDE9FE` | Badges, hover backgrounds |
| `primary-dark` | `#5B1DB7` | CTA hover states |
| `hero-bg` | `#0F172A` | Hero section, dark cards |
| `bg-base` | `#FAFAFA` | Page background |
| `surface` | `#FFFFFF` | Cards, panels |
| `border` | `#E2E8F0` | All borders |
| `text-primary` | `#0F172A` | Headings, body |
| `text-muted` | `#64748B` | Secondary text, placeholders |
| `text-inverse` | `#F8FAFC` | Text on dark backgrounds |
| `free` | `#16A34A` | Free pricing badge |
| `freemium` | `#D97706` | Freemium badge |
| `paid` | `#DC2626` | Paid badge |
| `opensource` | `#2563EB` | Open Source badge |

## Layout
- **Max width:** `1280px` container, centered
- **Grid:** 12-column, collapses to 4 → 2 → 1 column on mobile
- **Tool card grid:** 4 cols desktop, 2 cols tablet, 1 col mobile
- **Category grid:** 5 cols desktop, 3 cols tablet, 2 cols mobile
- **Spacing scale:** Tailwind default (4, 8, 12, 16, 24, 32, 48, 64px)
- **Border radius:** `rounded-xl` (12px) for cards, `rounded-full` for badges

## Component Designs

### Tool Card
```
┌─────────────────────────────────┐
│ [Logo 48x48] Tool Name          │
│              [Category Badge]   │
│ Short description (2 lines      │
│ max, line-clamp-2)              │
│ [Free] [tag1] [tag2]           │
│              [Visit Tool →]     │
└─────────────────────────────────┘
```

### Category Card
```
┌──────────────┐
│   [Icon]     │
│  Writing     │
│  124 tools   │
└──────────────┘
```

### Homepage Sections
1. **Header** — Logo left, nav center (Home | Categories | Search), language switcher right
2. **Hero** — Dark (#0F172A), large headline, subheadline, search bar (white), tool count stat
3. **Categories Grid** — 5×2 grid of category cards
4. **AdSense Banner** — 728×90 leaderboard, centered
5. **Featured Tools** — "Featured" heading, 3×2 grid of tool cards
6. **Trending This Week** — 4×2 grid, sorted by click count
7. **Newest Tools** — 4×2 grid, sorted by createdAt desc
8. **Footer** — Logo, tagline, copyright, language switcher

## RTL (Arabic)
- `<html dir="rtl">` set via next-intl on `/ar/` locale
- All Tailwind directional utilities use `rtl:` variant
- Logo always on logical-start side
- Chevrons/arrows flip via `rtl:scale-x-[-1]`
- Cairo font loaded only for `ar` locale

## AdSense Placement Rules
- Never inside the hero section
- Always in a `min-h-[90px]` container to prevent CLS
- Loaded client-side only (`'use client'` + `useEffect`)
- Graceful degradation if blocked (no JS errors)
