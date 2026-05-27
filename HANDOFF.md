# Session Handoff — AI Design Paradigm

> **For the next AI agent (or future me): read this file FIRST before doing anything.**
> It captures the full state of the project as of **2026-05-25 18:42 UTC+8**, so
> you can resume work without re-discovering decisions, paths, or pitfalls.
>
> After reading this, also skim `AGENTS.md`, `DESIGN.md`, and `docs/roadmap.md`.

---

## 1. What this project is

A **Vue 3 + Vite + Tailwind v4** application governed by a single `DESIGN.md`
semantic dictionary, with token-driven CI gates. The goal is to operationalize
the strategy from `d:\23300\Download\AI设计范式研究报告策略.md`:
turn 90 % of UI work into an **AI-driven engineering pipeline** where DESIGN.md
+ tokens/ + XState machines are the SSOT, and AI agents (Cursor / Claude Code /
Playwright Test Agents) generate, modify, and self-heal code under those constraints.

The user is **Elwaysss** (GitHub), solo maintainer, Chinese-speaking, on Windows.

---

## 2. Repo coordinates

| Where | What |
|---|---|
| Local workspace root | `F:\AI Design Paradigm\` — **this IS the git repo root** (after Option-A flatten) |
| Remote | <https://github.com/Elwaysss/AI_to_Design> |
| Default branch | `main` |
| Currently checked-out branch | `design/test-primary-bump` (working PR — see § 4 below) |
| Workspace path quirk | Path contains a space (`AI Design Paradigm`). PowerShell handles it but always quote it. |

### Three reference clones at workspace root (gitignored)

These live alongside the repo for browsing but are **not** part of git:

- `awesome-design-md-main/` — 30+ industry DESIGN.md examples (Notion, Cursor, Supabase, etc.)
- `style-dictionary-main/` — Style Dictionary source + examples
- `xstate-main/` — XState source + `templates/vue-ts/`, `templates/react-ts/`, etc.

---

## 3. Tech stack (locked-in)

| Layer | Choice | Version anchor in `package.json` |
|---|---|---|
| App framework | **Vue 3** (not React — the Vite scaffold chose this) | `vue ^3.5.34` |
| Build / dev | **Vite v8** | `vite ^8.0.12` |
| Style engine | **Tailwind CSS v4** (no `tailwind.config.js`, config lives in `@theme {}` inside `src/style.css`) | `tailwindcss ^4.3.0`, `@tailwindcss/vite ^4.3.0` |
| Token compiler | **Style Dictionary v4** | `style-dictionary ^4.0.0` |
| State machines | **XState v5** + `@xstate/vue` | `xstate ^5.0.0`, `@xstate/vue ^5.0.0` |
| E2E + visual | **Playwright** + **Chromatic** | `@playwright/test ^1.50.0`, `chromatic ^11.0.0` |
| Language | TypeScript ~6.0 | `typescript ~6.0.2` |
| Node | ≥ 20 (user is on Node 22 / npm 10) | engines field |

**Token CSS prefix is `--token-*`** (e.g. `--token-color-brand-primary`). The
`@theme` block in `src/style.css` re-binds them to Tailwind's semantic names
(`--color-brand-primary`, `--font-display`, `--radius-md`, `--spacing-4`, etc.)
so utility classes like `bg-brand-primary` work.

---

## 4. Current operational state (last session ended here)

### Git state

```
main           → pushed to remote (commit 6f454ed, 51 files, 6722 lines, "chore: bootstrap…Phase 1")
design/test-primary-bump → checked out, has ONE uncommitted modification:
                            tokens/base/color.json — clay.500 changed from #B8422E to #C04F38
                            (the agent edited it via StrReplace at session end)
```

### Next 4 commands the user needs to run

In PowerShell at `F:\AI Design Paradigm\`:

```powershell
git status                              # confirm clay.500 shows as modified
git diff tokens/base/color.json         # confirm -#B8422E +#C04F38
npm run tokens:build                    # re-compile tokens
npm run design:validate                 # re-validate DESIGN.md

git add tokens/base/color.json
git commit -m "design(color): test primary bump for CI demo"
git push -u origin design/test-primary-bump
```

Then open <https://github.com/Elwaysss/AI_to_Design>, click the "Compare & pull
request" banner, create the PR, and watch the three CI workflows fire. **This
closes Phase 1.**

### Dev server status

Was running on `http://localhost:5173` in terminal 9.txt earlier. User verified
the Boston Clay primary button renders and the counter increments. The user
may or may not have stopped the dev server at session end — running again is safe.

---

## 5. External resources — final status snapshot

(Cross-reference with the original strategy report's "外部资源清单".)

| Resource | Status | Notes |
|---|---|---|
| Cursor Pro | ✅ Active | User opens `F:\AI Design Paradigm\` as the workspace |
| Anthropic / OpenAI / Google API keys | ✅ Have | Not yet wired into MCP env vars |
| Git for Windows | ✅ Installed mid-session | Hit `git: command not found` once before |
| GitHub repo | ✅ Created + first push successful | `Elwaysss/AI_to_Design` |
| GitHub Actions | ✅ Wired (3 workflows) | Will first run when the user opens the token-bump PR (§ 4) |
| Stately.ai Studio | ✅ Registered via GitHub | Account: Elwaysss |
| Chromatic | ✅ Registered via GitHub | **CHROMATIC_PROJECT_TOKEN not yet added to GitHub repo secrets** — visual-regression workflow will skip until that's set |
| Mermaid MCP | ✅ Wired in `.cursor/mcp.json` | Using `mcp-mermaid` package; user must restart Cursor for it to come online |
| Stately MCP | ✅ Wired in `.cursor/mcp.json` | `@statelyai/mcp-server`; user must run `npx -y @statelyai/mcp-server auth login` once |
| Tailwind v4 | ✅ Installed + working | `npx tailwindcss init` deliberately removed in v4 — known confusion point |
| Style Dictionary | ✅ Installed + compiling all 5 platforms | `dist/css|tailwind|js|ios|android` |
| XState + @xstate/vue | ✅ Installed | Not yet wired into any real Vue component — see § 7 |
| Playwright | ✅ Installed | Test Agents (`init-agents --loop=cursor`) **not yet run** |
| Playwright Test Agents | ⏳ Pending | Documented in `docs/playwright-test-agents.md` |
| Docker Desktop | ❌ Not installed (intentional) | Decision recorded in `docs/docker-decision.md` — defer until needed |
| `@google/design.md` CLI | ⚠️ Probably 404 on npm | `package.json` script falls back to `scripts/validate-design.mjs` via `\|\|` — confirmed working |
| Hope AI / v0.dev / Lovable | ❌ None | Optional for Phase 2 |
| 商业字体 / Figma | 🟡 Deferred | User explicitly said skip for now |

---

## 6. Key architectural decisions (don't re-litigate)

1. **Option A — flatten layout.** Workspace root IS the git repo. The earlier
   `AI_to_design/` subfolder was deleted by `migrate.ps1` (which has already
   run). DO NOT reintroduce a subfolder for the app.
2. **Vue 3, NOT React.** The user's Vite scaffold picked Vue; we follow.
   All AI-generated components must use `<script setup lang="ts">` SFC syntax.
3. **XState v5 with `@xstate/vue`.** Anything with ≥ 3 transitions goes in
   `src/machines/`. Bind via `useMachine` from `@xstate/vue` (not `@xstate/react`).
4. **3-tier tokens.** `tokens/base/` → `tokens/semantic/` → `tokens/components/`.
   Components reference semantic; semantic references base. Never inline HEX.
5. **CSS variable prefix `--token-*`** (Style Dictionary `prefix: 'token'`)
   to avoid collisions with Tailwind v4's `--color-*` / `--font-*` namespaces.
6. **CODEOWNERS uses `@Elwaysss`** as the solo reviewer. When team grows,
   split into design-ops / frontend / qa / platform teams.
7. **Reference clones are gitignored** — they're browsing material, not deps.
8. **Boston Clay (#B8422E)** is the default primary, lifted from the strategy
   report's own example. Easy to swap by editing `tokens/base/color.json`.

---

## 7. Phase progress against the strategy report

| Phase | Courses | Status | Notes |
|---|---|---|---|
| **Phase 1** — Cognition base | 1 / 2 / 4 | 95 % ✅ | Just needs the token-bump PR to land green to formally close |
| **Phase 2** — Behavior + reproduction | 3 / 5 | 0 % ⏳ | Next major work: wire `loginMachine.ts` into a real `<LoginForm>` Vue SFC using `useMachine` |
| **Phase 3** — Quality immune system | 6 / 7 | 5 % ⏳ | CI workflows exist; Playwright Test Agents + Chromatic baselines not yet initialized |

### Immediate Phase 2 entry plan (when ready)

1. Run `npx playwright init-agents --loop=cursor` to scaffold Planner / Generator / Healer chatmodes.
2. Create `src/components/LoginForm.vue` that consumes `src/machines/loginMachine.ts`
   via `useMachine` from `@xstate/vue`. Reference `xstate-main/templates/vue-ts/src/Feedback.vue`
   for the exact binding pattern.
3. Add a route or replace `HelloWorld.vue` to show the LoginForm.
4. Optionally add `vite-plugin-watch-tokens` or a similar tweak so changing
   `tokens/**/*.json` triggers automatic `tokens:build` + HMR.

### Immediate Phase 3 entry plan (when ready)

1. Add `CHROMATIC_PROJECT_TOKEN` to GitHub repo secrets.
2. Run Playwright Test Agents Planner against the LoginForm screen to generate
   a first real `tests/e2e/login.spec.ts`.
3. Bump the primary color again — verify the visual-regression workflow now
   uploads a diff to Chromatic.

---

## 8. File inventory at session end

### Hand-written by the agent (50+ files)

```
F:\AI Design Paradigm\
├── README.md                              (entry point)
├── HANDOFF.md                             (this file)
├── SETUP.md                               (PowerShell verification checklist)
├── DESIGN.md                              (the SSOT — 9 modules, YAML frontmatter + Markdown body)
├── AGENTS.md                              (hard rules for AI agents — read FIRST)
├── CONTRIBUTING.md                        (branch / PR / commit conventions)
├── package.json                           (Vue + Vite + Tailwind v4 + XState/Vue + Style Dictionary + Playwright + Chromatic)
├── package-lock.json                      (committed)
├── vite.config.ts                         (plugin-vue + tailwindcss)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── style-dictionary.config.mjs            (prefix: 'token', 5 output platforms)
├── playwright.config.ts
├── index.html                             (title: AI Design Paradigm)
├── .gitignore                             (excludes node_modules, dist, the 3 reference clones, AI_to_design)
├── .cursor/mcp.json                       (mermaid + stately MCP)
├── .github/
│   ├── CODEOWNERS                         (@Elwaysss everywhere)
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       ├── design-validate.yml
│       ├── token-diff.yml
│       └── visual-regression.yml
├── tokens/
│   ├── README.md
│   ├── base/        color.json (clay/ink/moss/amber/lake) · typography · spacing · radius · elevation
│   ├── semantic/    color · typography
│   └── components/  button · card · input
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css                          (Tailwind v4 entry with @theme block)
│   ├── assets/      vite.svg · vue.svg    (moved up from old AI_to_design/)
│   ├── components/  HelloWorld.vue        (current default — uses bg-brand-primary as smoke test)
│   └── machines/
│       ├── README.md
│       └── loginMachine.ts                (XState v5 — framework-agnostic; needs Vue wrapper)
├── public/          favicon.svg · icons.svg
├── scripts/
│   └── validate-design.mjs                (fallback DESIGN.md validator)
├── tests/
│   ├── e2e/example.spec.ts                (placeholder — uses obsolete "Get started" assertion; needs rewrite for real components)
│   └── visual/.gitkeep
├── docs/
│   ├── playbook.md
│   ├── roadmap.md
│   ├── mcp-setup.md
│   ├── playwright-test-agents.md
│   └── docker-decision.md
└── migrate.ps1                            (DONE — keep or delete; harmless)
```

### Generated (not in git, regenerated by `npm run tokens:build`)

```
dist/
├── css/variables.css       (--token-* CSS variables)
├── tailwind/theme.css      (alternative output)
├── js/tokens.js + tokens.d.ts
├── ios/DesignTokens.swift
└── android/colors.xml + dimens.xml
```

---

## 9. Pitfalls & gotchas (learned the hard way)

1. **My (the agent's) Shell tool can't capture PowerShell output reliably**
   in this user's setup. Don't run `git status` / `npm install` expecting to
   see the output; instead, **ask the user to run commands themselves** and
   paste back any errors. Use `Read` on `terminals/*.txt` to check past output.
2. **Long `Write` calls (> ~7 min) get auto-interrupted.** Split large file
   creation into smaller chunks. We hit this twice on `.gitignore` and `.gitkeep`.
3. **`Glob` recursively matches across the whole workspace, including the
   3 reference clones (~5000+ files).** Use very specific patterns like
   `tokens/**/*.json` and still expect noise from `style-dictionary-main/`.
   Prefer `Read` on a specific known path for verification.
4. **`@google/design.md` is probably a 404.** The `package.json` script uses
   `\|\|` to fall back to `scripts/validate-design.mjs`. Both NPM warnings
   ("mdast was renamed to remark") and "command not found" are normal — the
   script still exits 0 because of the fallback.
5. **First git push from CN networks often times out.** Retry once after Git
   Credential Manager pops the OAuth browser window. Subsequent pushes are fine.
6. **`npx tailwindcss init` was removed in v4.** Don't try to "fix" the lack
   of `tailwind.config.js` — that's intentional. All config lives in `@theme {}`.
7. **The user already deleted `AI_to_design/`** via `migrate.ps1`. Do NOT
   try to "re-flatten" or look for it.
8. **CRLF warnings on git add are harmless** on Windows. Don't try to fix
   them by changing `core.autocrlf`.

---

## 10. How to resume in a new chat

Paste the following at the start of the new conversation:

> Read `F:\AI Design Paradigm\HANDOFF.md` first. Then read `AGENTS.md` and
> the relevant section of `DESIGN.md`. The user is Elwaysss, working on the
> AI Design Paradigm project. We were in the middle of Phase 1 closure —
> the user has an uncommitted change in `tokens/base/color.json` on branch
> `design/test-primary-bump` that needs to be committed and pushed to trigger
> the first CI run. After that PR goes green, we move to Phase 2 (XState +
> Vue integration).

The agent should then:

1. Read this file in full.
2. Read `AGENTS.md`.
3. Confirm where things stand with `git status` (asking the user to run it).
4. Pick up from § 4 above.

---

## 11. Useful one-liners

```powershell
# Where am I?
cd "F:\AI Design Paradigm"; git status; git log --oneline -5

# Re-build everything
npm run tokens:build && npm run design:validate

# Run the app
npm run dev

# What's on the working PR branch?
git diff main..design/test-primary-bump

# Reset to a clean baseline
git checkout main; git reset --hard origin/main

# Inspect compiled tokens
Get-Content dist\css\variables.css | Select-String "brand-primary"
```

---

*End of handoff. Total: ~25 KB. If you (the next agent) read this and
understand: tokens flow → DESIGN.md is law → Vue 3 + @xstate/vue → CI gates
the truth → Phase 1 nearly done → Phase 2 = XState in real components,
you're caught up.*
