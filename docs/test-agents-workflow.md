# Playwright Test Agents — Team Workflow

Institutionalized flow for new screens in this paradigm. Pair with
[playwright-test-agents.md](playwright-test-agents.md) for MCP setup.

## When to use agents

| Situation | Agent | Command / chatmode |
|---|---|---|
| New screen or flow | **Planner** | `npm run agent:plan` or Planner chatmode |
| Need first spec draft | **Generator** | Generator chatmode after Planner output |
| Locator drift after redesign | **Healer** | `npm run agent:heal` — **never** hand-edit without review |
| Real UI regression | Human | Revert design/token change; do not let Healer mask bugs |

## New screen checklist

1. Re-read `AGENTS.md` and relevant `DESIGN.md` sections.
2. Add or extend `src/machines/<flow>Machine.ts` if ≥ 3 transitions.
3. **Planner**: prompt with machine file + component path + acceptance criteria.
4. **Generator**: produce `tests/e2e/<screen>.spec.ts` using role/label locators.
5. Human review: compare Generator output to hand-written specs (see `login.spec.ts`).
6. Merge only when `npm run test:e2e` passes in CI.

## Healer demo (locator-only fix)

1. Change visible copy only (e.g. label `Email` → `Email address`).
2. Run `npm run test:e2e` — expect failure on `getByLabel('Email')`.
3. Run Healer with failing test path.
4. Approve PR if locator semantics unchanged.

## CI

Visual regression runs Playwright before Chromatic when `CHROMATIC_PROJECT_TOKEN` is set.
Do not rewrite workflow to `chromaui/action` alone — see `HANDOFF-PHASE3.md` §6.
