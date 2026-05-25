# Team Playbook

This playbook is the day-to-day handbook for working inside the AI Design Paradigm pipeline.
Pair it with the strategy report and `docs/roadmap.md`.

---

## 1. Mental model

```
DESIGN.md  ───►  tokens/**  ───►  dist/**  ───►  src/app.css (@theme)
                                                     │
                              src/machines/**  ──────┴──►  AI-generated components
                                                                  │
                                            tests/e2e/ + Chromatic + Healer
```

- The Git repo, not Figma, is the **Single Source of Truth**.
- Every visual or interaction decision must be expressible as either
  *(a)* a token, *(b)* a section of `DESIGN.md`, or *(c)* an XState transition.

---

## 2. Roles after the transition

| Role | What changes | What stays |
|---|---|---|
| Designer | Becomes "Token curator + aesthetic reviewer". Owns `DESIGN.md` and `tokens/`. | Still drives brand & UX research. |
| Frontend engineer | Spends more time defining `src/machines/` and reviewing AI-generated diffs. | Still owns architecture & performance. |
| QA | Curates the Playwright Planner / Healer prompts. Reviews Chromatic diffs. | Still owns release readiness. |
| AI agent | Generates components, tests, and locator fixes inside hard constraints. | n/a |

---

## 3. Day-to-day flows

### 3.1 I want to change a brand color
1. Branch: `design/color-bump-primary`.
2. Edit `tokens/base/color.json` and the corresponding section of `DESIGN.md`.
3. Push — the `token-diff` workflow posts a diff comment with downstream impact.
4. Get `@org/design-ops` approval. Chromatic diff is auto-attached.
5. Merge. Healer agent rebases dependent locators in subsequent PRs as needed.

### 3.2 I want to ship a new screen
1. Re-read `AGENTS.md` (yes — every time).
2. Decide if the flow has ≥ 3 transitions. If yes, create `src/machines/<flow>Machine.ts` first.
3. Ask the AI agent to generate the component. Provide the path to `DESIGN.md`, the relevant
   token files, and the machine file.
4. The agent must ship: component + Playwright spec + (optional) Storybook story.
5. Open PR with the template. CI runs design validate + tokens build + Playwright + Chromatic.

### 3.3 A Playwright test broke after a redesign
1. **Do not** silently rewrite the locator.
2. Trigger Healer: `npm run agent:heal`.
3. Review Healer's proposed patch in the PR. Approve if the new locator preserves semantics.
4. If the failure is a real regression (not a locator drift), revert the offending change.

### 3.4 The AI agent invented a new HEX
This is a *hard block*. CI will fail at `design:validate`. Don't override — instead:
1. Add the value to `tokens/base/color.json` (with PR review), or
2. Re-prompt the agent and remind it of `AGENTS.md` § "Hard Rules".

---

## 4. Onboarding a new product team

1. Clone this repo as a starter; rename, then run `npm install && npm run tokens:build`.
2. Replace `meta.name`, `meta.theme`, and the `colors`/`typography` blocks in `DESIGN.md`.
3. Pick a reference template from
   [`voltagent/awesome-design-md`](https://github.com/voltagent/awesome-design-md)
   for the visual direction (Notion / Runway / Supabase / Cursor / …).
4. Update `.github/CODEOWNERS` with real team slugs.
5. Add Chromatic + Stately + model API key secrets to the repo settings.
6. Schedule the Phase 1 → Phase 3 gantt in `docs/roadmap.md`.

---

## 5. Things that look like shortcuts but aren't

- ❌ Letting one engineer hand-edit `dist/css/variables.css` to ship a hotfix faster.
- ❌ Inlining a HEX in a single "tiny" component "just this once".
- ❌ Promoting a `feat/*` branch directly to `main` without `design/*` review for a color tweak.
- ❌ Pinning Tailwind to a stock palette to avoid the @theme indirection.

Every one of these decouples the SSOT from the running product and is the root cause
of style drift in the wild.

---

## 6. KPIs to track

| Metric | Target |
|---|---|
| AI-generated LOC ratio (per release) | ≥ 70 % by end of Phase 3 |
| Mean time from `DESIGN.md` change to deployed UI | ≤ 1 day |
| Escaped visual regressions / release | ≤ 1 |
| Healer-proposed locator fixes accepted | ≥ 80 % |
| Time spent maintaining tests manually | ≤ 4 person-hours / week |

Plot these on the ROI dashboard built in Phase 4.
