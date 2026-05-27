# Session Handoff — Phase 2 Closeout

> **For the next AI agent (or future me)**: this is the Phase 2 closeout snapshot.
> Read [HANDOFF.md](HANDOFF.md) FIRST — it's the Phase 1 closeout archive and the
> Phase-2 doc you're holding now is a continuation of that. Together they cover
> the project state as of **2026-05-27 15:18 UTC+8** (Phase 2 PR #3 merged).
>
> Reading order: `HANDOFF.md` → `HANDOFF-PHASE2.md` → `AGENTS.md` → `DESIGN.md` → `docs/roadmap.md`.

---

## 1. Where Phase 2 left things

PR #3 (`feat(login-form): bind loginMachine to Vue SFC, repair test pipeline`)
landed as a squash merge into `main`. The dev server default route is now a real
interactive LoginForm card, not the Vite scaffold counter button.

### git topology

```
main (origin/main)
├── <squash-merge>  Merge pull request #3 from Elwaysss/feat/login-form  ← Phase 2 entry
├── f59e49c         Merge pull request #2 from Elwaysss/chore/handoff-doc
├── c178661         Merge pull request #1 from Elwaysss/design/test-primary-bump
├── ee8e1b3         design(color): test primary bump for CI demo
└── 6f454ed         chore: bootstrap AI design paradigm starter (Phase 1)
```

Branches that landed in PRs are deleted from origin. `main` is clean. Working
tree should be clean unless you stopped mid-task.

### What's actually running now

| Surface | State |
|---|---|
| `npm run dev` → `http://127.0.0.1:5173/` | Renders LoginForm card (Sign in / Email / Password / Boston Clay CTA) |
| `npm run test:e2e -- --project=chromium` | 5 spec pass in ~6s locally (login.spec.ts) |
| CI on every PR | 3 workflows fire: `design.md validate`, `token diff` (when DESIGN.md or tokens/** changes), `visual regression` |
| CI `visual regression` | Passing in 1m 40s on CI (chromium + webkit + mobile = 15 tests) |
| Stately Studio actor visualization | loginMachine.ts is paste-ready into stately.ai |
| Chromatic upload | Skipped because `CHROMATIC_PROJECT_TOKEN` still isn't in repo secrets — Phase 3 entry task |

---

## 2. What Phase 2 actually shipped (9 file deltas)

| File | Status | Reason |
|---|---|---|
| `src/components/LoginForm.vue` | New | Vue 3 SFC, `useMachine(loginMachine)`, consumes 12 tokens |
| `src/App.vue` | Changed | import HelloWorld → LoginForm |
| `src/components/HelloWorld.vue` | Kept, not deleted | Reference SFC for "how to write a token-driven Vue component" |
| `tests/e2e/login.spec.ts` | New | 5 specs across idle / submitting / success / failure; brand-primary color assertion |
| `tests/e2e/example.spec.ts` | Deleted | Three death conditions documented in HANDOFF.md § 8 are obsolete |
| `playwright.config.ts` | Changed | Added `webServer` block so CI auto-starts vite |
| `vite.config.ts` | Changed | Added `server: { host: '127.0.0.1', port: 5173, strictPort: true }` — see § 4 bullet 1 |
| `src/machines/loginMachine.ts` | Changed | Doc comment React → Vue; authenticate stub gained a demo failure trigger (email containing 'fail' rejects) |
| `DESIGN.md` | Changed (§ 9) | Agent Prompt Guide React → Vue 3, `src/app.css` → `src/style.css` |
| `docs/playwright-test-agents.md` | Changed (L17) | `cd F:\AI Design Paradigm\AI_to_design` → `cd "F:\AI Design Paradigm"` |
| `.github/workflows/visual-regression.yml` | Changed | Hoisted secrets into job-level env so the workflow YAML parses — see § 4 bullet 2 |

Total: 1 new SFC, 1 new spec, 1 deleted spec, 8 modified files.

---

## 3. Phase progress against the strategy report

| Phase | Courses | Status | Notes |
|---|---|---|---|
| **Phase 1** — Cognition base | 1 / 2 / 4 | ✅ 100 % | All three workflows landed green on real PRs (after the YAML fix retroactively unblocked the historical Failures) |
| **Phase 2** — Behavior + reproduction | 3 / 5 | ✅ ~95 % | LoginForm wired through @xstate/vue; visual-regression actually executing Playwright in CI; only missing piece is using Playwright Test Agents to *regenerate* the hand-written spec |
| **Phase 3** — Quality immune system | 6 / 7 | ⏳ ~10 % | CI workflows are now properly parsed and running; Chromatic upload still skipped; Test Agents chatmodes not generated |

---

## 4. Hard-won lessons from this session (write these into agent prompts)

These five caused multi-hour rabbit holes during Phase 2 wrap. Bake them into
prompts so the next AI doesn't re-discover them.

### 1. Vite 8 on Windows + workspace path with spaces silently fails to bind the port

Vite 8's default host resolution under Windows can print `Local: http://localhost:5173/`
while NOT actually binding any TCP socket on 5173. `netstat -ano | findstr :5173`
returns empty. The cure is to always pin host + port + strictPort in `vite.config.ts`:

```ts
server: {
  host: '127.0.0.1',
  port: 5173,
  strictPort: true
}
```

`strictPort: true` is the critical guard — without it Vite silently drifts to
the next free port (or, as we saw, silently doesn't bind at all) and you get
phantom "ready" messages.

### 2. GitHub Actions does NOT allow `secrets.*` inside a step's `if:` expression

This bug was latent from the bootstrap commit (`6f454ed`). All six historical
`visual-regression` Failure runs (#1 → #6) were caused by ONE workflow YAML
parse error:

```
(Line: 37, Col: 13): Unrecognized named-value: 'secrets'.
Located at position 1 within expression: secrets.CHROMATIC_PROJECT_TOKEN != ''
```

The fix is to hoist the secret into job-level `env:`, then reference `env.X`
from `if:`:

```yaml
jobs:
  playwright:
    env:
      CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    steps:
      - name: Publish to Chromatic
        if: env.CHROMATIC_PROJECT_TOKEN != ''
        # ...
```

Counterintuitive because `secrets.*` IS valid inside step `env:` and `with:`,
just not `if:`. Whenever you write an `if:` referencing a secret, refactor
through env.

### 3. CN-network first-time push/pull/curl to github.com hits TLS handshake timeout

5 separate times in this session a `git push -u origin` or `git pull origin main`
returned `Failed to connect to github.com port 443 after 21XXX ms`. The second
attempt always succeeded. Don't waste minutes debugging — retry once, then
investigate.

(Already in HANDOFF.md § 9 bullet 5, but worth re-stating: it's the single
most common time-waster in this repo's workflow.)

### 4. XState v5 guard duplicating invoke actor's validation makes the failure state unreachable

`loginMachine` originally had a `looksValid` guard requiring `password.length >= 6`,
AND the `authenticate` stub raised the same error. The guard always wins, so
`onError` could never fire, and the `failure` state became dead code.

Lesson: when reviewing or designing state machines, walk EVERY transition's
preconditions to confirm each state is reachable. The Stately MCP server is
specifically for this kind of check — use it before committing.

Our fix: keep the guard for fast-feedback UX, but added a demo email trigger
(`email.includes('fail')` rejects) so the failure path stays reachable for
demos and tests:

```ts
if (input.email.toLowerCase().includes('fail')) {
  throw new Error('Invalid credentials. Please try again.');
}
```

### 5. A "Failure" CI run might mean "the workflow YAML didn't parse" — check that FIRST

We spent significant time speculating about Playwright spec death conditions
when the actual root cause was that the `visual-regression` workflow had never
once successfully executed `npm run test:e2e`. The mental ordering should be:

```
CI red → open Actions tab → click failing run → check FIRST step status
    ├── First step is "Set up job" with parse error → it's a YAML problem
    └── First step is later (Install, Run Playwright, etc.) → it's a runtime problem
```

If you see `Invalid workflow file` or `Unrecognized named-value` anywhere in
the run page, stop debugging downstream concerns and fix the YAML first.

---

## 5. Phase 3 entry plan (start here next session)

Direct continuation of [HANDOFF.md § 7](HANDOFF.md):

### Mandatory

1. **Add `CHROMATIC_PROJECT_TOKEN` to repo secrets**.
   - Log into <https://chromatic.com> with GitHub.
   - Link the `Elwaysss/AI_to_Design` repo, create a project.
   - Copy the project token.
   - `gh secret set CHROMATIC_PROJECT_TOKEN` (or do it in GitHub UI: Settings → Secrets and variables → Actions → New repository secret).
   - This is the LAST gate before visual baseline uploads start working.

2. **Initialize Playwright Test Agents**.
   ```powershell
   cd "F:\AI Design Paradigm"
   npx playwright init-agents --loop=cursor
   ```
   Produces `.github/chatmodes/{planner,generator,healer}.chatmode.md`. **You
   need to restart Cursor** after this for the chatmode switcher to pick them up.

3. **Have Planner regenerate `login.spec.ts`**.
   - Switch chatmode to Planner.
   - Prompt: *"Plan E2E tests for the login flow at `src/components/LoginForm.vue` against `src/machines/loginMachine.ts`. Read DESIGN.md § 7 for do/don't list."*
   - Planner emits a Markdown test strategy; review.
   - Switch to Generator: *"Convert the plan above into Playwright specs."*
   - Diff Generator's output against our hand-written `login.spec.ts`. Probably
     keep both for one cycle to compare quality.

### Reactive demo (good for blog post / showcasing the paradigm)

4. **Healer self-heal demo**.
   - Manually break LoginForm.vue: change `<label for="login-email">Email</label>` to `Email address`.
   - Run `npm run test:e2e -- --project=chromium` — the `getByLabel('Email')` test will fail.
   - Switch chatmode to Healer.
   - Prompt: *"Failing test: `tests/e2e/login.spec.ts:N`. Heal the locator."*
   - Healer should propose a PR updating the locator to match new DOM, without
     touching component code.

5. **Re-bump primary color**:
   - Edit `tokens/base/color.json` clay.500 again (e.g. `#C04F38` → `#B85230`).
   - Push to a `design/primary-bump-v2` branch + PR.
   - Verify Chromatic now uploads a visual diff (not skipped) and CI links to it from the PR.

### Optional / nice-to-have DX cleanup

These are nuisances we noticed during Phase 2 but deferred:

- `package.json` `design:validate` script wastes minutes on `npx -y @google/design.md@latest` (404 on npm registry). Drop the npx prefix; just call the fallback `node scripts/validate-design.mjs DESIGN.md` directly.
- `vite-plugin-watch-tokens` or similar so `tokens/**/*.json` edits trigger automatic `tokens:build` + HMR (mentioned in HANDOFF.md § 7).
- Branch protection rules on `main` requiring 1 CI-green PR before merge (currently relies on convention).

---

## 6. Files / paths / conventions that haven't changed

Everything in [HANDOFF.md § 2 / § 3 / § 6 / § 8](HANDOFF.md) still holds:

- Workspace root IS the git repo root (no `AI_to_design/` subfolder)
- Vue 3 + Vite 8 + Tailwind v4 + Style Dictionary v4 + XState v5 + Playwright 1.50+
- Token CSS prefix is `--token-*`
- Three reference clones (`awesome-design-md-main/`, `style-dictionary-main/`, `xstate-main/`) at workspace root, gitignored
- CODEOWNERS uses `@Elwaysss` as solo reviewer
- Branch convention: `design/<topic>` for tokens & DESIGN.md, `feat/<topic>` for features, `fix/<topic>` for bugs, `chore/<topic>` for tooling & docs

---

## 7. How to resume in a new chat (paste this at the start)

> Read `HANDOFF.md` AND `HANDOFF-PHASE2.md` first, in that order. Then skim
> `AGENTS.md` and the relevant sections of `DESIGN.md`. The user is Elwaysss,
> working on the AI Design Paradigm project. Phase 1 and Phase 2 are both
> closed (main has 5 commits, three landed PRs). We're entering Phase 3 —
> Playwright Test Agents initialization, Chromatic visual baseline upload,
> and Healer self-heal demo. Use `HANDOFF-PHASE2.md § 5` as the entry plan.

The agent should then:

1. Read both handoff files in full.
2. Read `AGENTS.md`.
3. Confirm `main` is up to date (`git status` + `git log --oneline -5`).
4. Ask the user which Phase 3 entry task to tackle first (Chromatic token,
   init-agents, or Healer demo).

---

*End of Phase 2 handoff. Total: ~10 KB. If you (the next agent) read both
HANDOFF.md and this file and understand: token pipeline still SSOT-driven →
Vue 3 + @xstate/vue → CI now actually executes Playwright → Phase 3 = AI
test agents + Chromatic baselines, you're caught up.*
