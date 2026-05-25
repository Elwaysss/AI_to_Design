# Playwright Test Agents — Quickstart

Playwright Test Agents is the official AI-test pipeline shipped with
Playwright (docs: <https://playwright.dev/docs/test-agents>). It provides
three agent roles that consume `DESIGN.md` + the running app to autonomously
explore, generate, and self-heal browser tests.

| Agent | Role | Output |
|---|---|---|
| **Planner** | Reads the app + DESIGN.md, walks the UI semantically, drafts a Markdown test strategy | `.github/chatmodes/planner.chatmode.md` |
| **Generator** | Converts that plan into runnable `.spec.ts` files under `tests/e2e/` | new `tests/e2e/*.spec.ts` |
| **Healer** | When a locator breaks after a redesign, re-grounds it against the live DOM and proposes a patch | PR with locator fixes |

## Install

```powershell
cd F:\AI Design Paradigm\AI_to_design

# 1. Make sure Playwright is recent enough to ship the agents feature.
npm install -D @playwright/test@latest
npx playwright install --with-deps

# 2. Initialize agent chatmode files for Cursor / VS Code.
npx playwright init-agents --loop=cursor
# Other valid values for --loop: vscode | claudecode | codex
```

After `init-agents`, you'll see:

```
.github/chatmodes/
  ├── planner.chatmode.md
  ├── generator.chatmode.md
  └── healer.chatmode.md
```

These files are **the prompts** that Cursor uses when you switch the agent's
chatmode. They reference `DESIGN.md`, `tokens/**`, and `src/machines/**` so
the AI has the full context for grounded test generation.

## Daily use

### Generate a new test suite for a screen

1. Open Cursor → switch chat mode to **Planner**.
2. Prompt: *"Plan E2E tests for the login flow. Read `src/machines/loginMachine.ts`
   for the state contract and `DESIGN.md` § 7 for the do/don't list."*
3. Planner produces a Markdown plan; review.
4. Switch to **Generator** chatmode → *"Convert the plan above into Playwright specs."*
5. Generator writes files to `tests/e2e/`. Run `npx playwright test` to validate.

### Heal a broken test after a redesign

1. CI shows a Playwright run failing because a locator can't find its element.
2. Locally: switch chatmode to **Healer**.
3. Prompt: *"Failing test: `tests/e2e/login.spec.ts:42`. Heal the locator."*
4. Healer opens the URL, inspects the live DOM, proposes a patch.
5. Apply the patch, run the test, open PR. **Never** silently rewrite locators —
   always go through the Healer so you have a paper trail.

## CI integration

The `visual-regression.yml` workflow in `.github/workflows/` already runs
`playwright test`. To also have a Healer pass run automatically when a check
fails, add a second job:

```yaml
heal-on-failure:
  needs: playwright
  if: failure()
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: '20' }
    - run: npm ci
    - run: npx playwright install --with-deps
    - name: Run Healer agent
      env:
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
      run: npx playwright agent heal --auto-commit
```

This requires an `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY` if you use GPT)
in the repo's secrets. Healer opens a follow-up PR with proposed locator fixes
— *never* push directly to the failing branch.

## Reality check

As of 2026, the agent flag (`--loop`) and chatmode generation are still
relatively new. If `npx playwright init-agents` fails:

- Verify Playwright version: `npx playwright --version` (need 1.50+ for stable agent support).
- Fall back to the manual setup at <https://playwright.dev/docs/test-agents#manual-setup>
  — it gives you the raw `.chatmode.md` templates you can drop in by hand.

## Cost discipline

Each agent run can fire dozens of model calls. To stay sane:

1. Pin a cheap model (e.g. Sonnet) as the **default**.
2. Reserve high-reasoning models (Opus / GPT-5.3-codex) for failed healing
   attempts that the default model can't resolve.
3. Cap concurrent agent runs in CI to 1; visual diffs are I/O-bound anyway.
