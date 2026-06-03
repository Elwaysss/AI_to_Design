# Phase 4 — product-001 Acceptance Experiment

**Goal:** Ship a personal utility (≤ 5 features) in **≤ 7 calendar days** using this
template as a GitHub Template fork. First user is you. Measure wall-clock days for ROI.

## Product candidates (pick one)

| Idea | Core features (≤ 5) |
|---|---|
| Reading list | Add URL/title, mark read, filter, delete, export |
| Habit tracker | Define habit, daily check-in, streak, weekly view, archive |
| Quick notes | Create, tag, search, pin, delete |
| Bookmarks + summary | Save link, optional AI summary field, tags, open, delete |

## Fork checklist

```powershell
# GitHub: Use this template → clone
cd path\to\reading-list   # example slug
npm install
npm run init -- --name "Reading List" --slug reading-list --color "#2563EB" --force
npm run design:from -- notion --force   # optional brand
npm run supabase:init
npm run vercel:init -- --yes
npm run dev:port   # note port for parallel products
```

## Stack (out of paradigm scope — use standards)

| Layer | Tool |
|---|---|
| UI SSOT | DESIGN.md + tokens + machines (this repo) |
| Auth + DB | Supabase |
| Hosting | Vercel |
| Client state | Pinia (add when needed) |
| Data fetching | TanStack Query or fetch + Pinia |

## ROI tracking

Fill this table in the **product repo** README or a `PRODUCT-001-LOG.md`:

| Milestone | Target | Actual (days) | Notes |
|---|---|---|---|
| Day 0 — template init | 0.5 | | `init` + supabase + vercel |
| Day 1–2 — data model + auth | 2 | | schema, RLS, login |
| Day 3–5 — core features | 3 | | ≤ 5 features |
| Day 6–7 — deploy + smoke | 2 | | Vercel prod, e2e green |
| **Total product-001** | **≤ 7** | | |

**product-002** (later): same template, different idea. Target **2–3× faster** than product-001 total days.

## Definition of done

- [ ] Production URL on Vercel
- [ ] Real Supabase auth (not demo stub) for your own account
- [ ] At least one XState machine for a multi-step flow
- [ ] Zero raw HEX in components (CI `design:validate` + token-diff green)
- [ ] `npm run test:e2e` green on PR
- [ ] You used the app yourself for 3+ days

## Out of scope for Phase 4

External beta users, monetization, Datadog/Sentry full rollout, multi-tenant admin.
