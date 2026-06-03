# Playwright Test Agents — Quickstart

> **Institutional workflow:** see [test-agents-workflow.md](test-agents-workflow.md).

Playwright Test Agents is the official AI-test pipeline shipped with
Playwright (docs: <https://playwright.dev/docs/test-agents>). It provides
three agent roles that consume `DESIGN.md` + the running app to autonomously
explore, generate, and self-heal browser tests.

| Agent | Role | Output |
|---|---|---|
| **Planner** | Reads the app + DESIGN.md, walks the UI semantically, drafts a Markdown test strategy | `specs/*.md` test plans |
| **Generator** | Converts that plan into runnable `.spec.ts` files under `tests/e2e/` | new `tests/e2e/*.spec.ts` |
| **Healer** | When a locator breaks after a redesign, re-grounds it against the live DOM and proposes a patch | PR with locator fixes |

## Install (one-time, already done in starter)

```powershell
cd "F:\AI Design Paradigm"

npm install -D @playwright/test@latest
npx playwright install --with-deps

# Cursor is VS Code–compatible — use vscode loop (not --loop=cursor, removed in Playwright 1.50+)
npx playwright init-agents --loop=vscode
```

After `init-agents`, the starter ships:

```
.github/agents/
  ├── playwright-test-planner.agent.md
  ├── playwright-test-generator.agent.md
  └── playwright-test-healer.agent.md
specs/                          ← Planner writes test plans here
tests/e2e/seed.spec.ts          ← Generator bootstrap (skipped in CI)
.cursor/mcp.json                ← includes playwright-test MCP server
.vscode/mcp.json                ← same MCP config for VS Code
```

**Restart Cursor fully** after pulling so the `playwright-test` MCP server loads.

## Daily use

### Generate a new test suite for a screen

1. Open Cursor → pick agent **playwright-test-planner** (or Copilot equivalent).
2. Prompt: *"Plan E2E tests for the login flow. Read `src/machines/loginMachine.ts`
   for the state contract and `DESIGN.md` § 7 for the do/don't list."*
3. Planner produces a Markdown plan in `specs/`; review.
4. Switch to **playwright-test-generator** → *"Convert the plan above into Playwright specs."*
5. Generator writes files to `tests/e2e/`. Run `npm run test:e2e` to validate.

### Heal a broken test after a redesign

1. CI shows a Playwright run failing because a locator can't find its element.
2. Locally: use agent **playwright-test-healer**.
3. Prompt: *"Failing test: `tests/e2e/login.spec.ts:42`. Heal the locator."*
4. Healer opens the URL, inspects the live DOM, proposes a patch.
5. Apply the patch, run the test, open PR. **Never** silently rewrite locators —
   always go through the Healer so you have a paper trail.

## CI integration

The `visual-regression.yml` workflow runs Playwright + Chromatic when
`CHROMATIC_PROJECT_TOKEN` is set. Healer auto-commit in CI is optional and
requires `ANTHROPIC_API_KEY` in repo secrets — defer until needed.

## Reality check

If `npx playwright init-agents` fails:

- Verify Playwright version: `npx playwright --version` (need 1.50+).
- Valid `--loop` values: `vscode`, `claude`, `copilot`, `opencode`, `vscode-legacy`.
- Fall back to manual setup: <https://playwright.dev/docs/test-agents#manual-setup>

## Cost discipline

Each agent run can fire dozens of model calls. To stay sane:

1. Pin a cheap model (e.g. Sonnet) as the **default**.
2. Reserve high-reasoning models for failed healing attempts.
3. Cap concurrent agent runs in CI to 1.
