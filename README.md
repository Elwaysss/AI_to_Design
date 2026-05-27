# AI Design Paradigm

Vue 3 + Vite + Tailwind v4 application governed by a single `DESIGN.md`
semantic dictionary, with a token-driven CI pipeline and AI-agent-friendly
workflows.

> Synced to <https://github.com/Elwaysss/AI_to_Design>.

**👉 First time here? Open `SETUP.md` and follow steps 0–7.**
**👉 Resuming a previous session (or a new AI agent)? Read `HANDOFF.md` first.**

## Repo layout

```
F:\AI Design Paradigm\        <- workspace root = Git repo root
├── DESIGN.md                 <- semantic dictionary (9 modules)
├── AGENTS.md                 <- hard rules for AI agents
├── CONTRIBUTING.md
├── SETUP.md                  <- start here
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── index.html
├── style-dictionary.config.mjs
├── playwright.config.ts
├── migrate.ps1               <- run once, then delete
├── .cursor/mcp.json
├── .github/
│   ├── workflows/            <- design-validate / token-diff / visual-regression
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── tokens/
│   ├── base/                 <- raw HEX / px / numbers
│   ├── semantic/             <- color.brand.primary, etc.
│   └── components/           <- button.json / card.json / input.json
├── src/
│   ├── style.css             <- Tailwind v4 entry, @theme binds tokens
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   └── HelloWorld.vue    <- doubles as Phase 1 smoke test
│   ├── assets/               <- vue.svg, vite.svg
│   └── machines/             <- XState v5 actors (loginMachine.ts is the canonical example)
├── tests/
│   ├── e2e/                  <- Playwright specs
│   └── visual/               <- Chromatic baselines (owned by Chromatic, not edited locally)
├── scripts/
│   └── validate-design.mjs   <- fallback DESIGN.md validator
└── docs/
    ├── playbook.md           <- team SOP, role re-shaping, KPIs
    ├── roadmap.md            <- phased gantt
    ├── mcp-setup.md          <- Mermaid + Stately MCP config
    ├── playwright-test-agents.md
    └── docker-decision.md
```

**Outside the repo** but inside the workspace folder (kept for browsing, not committed):

- `awesome-design-md-main/` — 30+ industry DESIGN.md examples
- `style-dictionary-main/` — Style Dictionary source + examples
- `xstate-main/` — XState source + Vue/React/Svelte templates

## Quickstart

```powershell
# 0. Migrate the pre-flatten Vite scaffold (one-time):
powershell -ExecutionPolicy Bypass -File .\migrate.ps1

# 1. Sanity:
npm run tokens:build
npm run design:validate

# 2. Run:
npm run dev
# Open http://localhost:5173 — button should be Boston Clay (#B8422E).

# 3. Tests (after writing your first spec):
npm run test:e2e

# 4. CI for visual regression:
#    Add CHROMATIC_PROJECT_TOKEN to GitHub repo secrets, then PRs publish to Chromatic automatically.
```

## Phased rollout

- **Phase 1 — Cognition base & constraint boundaries** (modules 1 / 4 / 2 in the strategy report)
  ✅ Tokens, DESIGN.md, Git SSOT, CI guards.
- **Phase 2 — Behavior mapping & code-level reproduction** (modules 3 / 5)
  ⏳ XState actors + Tailwind v4 + AI component generation pipeline.
- **Phase 3 — Long-term quality immune system** (modules 6 / 7)
  ⏳ Playwright Test Agents + Chromatic + Healer + token-diff PR review.

See `docs/roadmap.md` for the gantt and `docs/playbook.md` for the team handbook.

## Hard rules for contributors (and AI agents)

1. Never inline raw HEX / px / stock Tailwind colors in components.
   Use tokens via Tailwind utilities (`bg-brand-primary`, `text-display-lg`) or
   raw CSS vars (`var(--token-color-brand-primary)`).
2. Multi-step flows (≥ 3 transitions) MUST live in `src/machines/` as XState
   actors; consume via `@xstate/vue`'s `useMachine`.
3. Any change to `DESIGN.md` or `tokens/**` goes through PR review with a
   listed impact diff (CI bot will post one automatically).
4. Visual regression baselines live in Chromatic; don't hand-edit snapshots.

Full ruleset in `AGENTS.md`.
