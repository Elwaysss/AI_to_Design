# `src/machines/` — XState v5 Actors

Every multi-step UI flow in this repo lives here as an XState actor.

## Why

- Eliminates the "ad-hoc `useState` + nested `if`" anti-pattern.
- Gives AI agents an explicit, finite, machine-readable behavior contract.
- Visualizable and exportable in [Stately Studio](https://stately.ai).
- Validatable with the **Mermaid MCP server** before commit (see `AGENTS.md`).

## File convention

```
<flowName>Machine.ts        // the actor
<flowName>Machine.test.ts   // optional unit tests
```

## Pattern

1. Use `setup({ types, actors, actions, guards }).createMachine({ ... })` (XState v5).
2. External side-effects go through `fromPromise` / `fromCallback` actors — never inline.
3. Components consume via `useMachine` / `useActor` from `@xstate/react`.
4. If your flow exceeds ~ 15 states, split it into parent + spawned child actors.

## How AI agents use this

When an agent is asked to build "a form", "a wizard", "a stepper",
"a paginated list", or anything else with ≥ 3 transitions, it MUST:

1. Look for or create the appropriate `*Machine.ts` here.
2. Wire the UI component to it via `useMachine`.
3. Never reach for `useState` for state that lives in this file.

See `loginMachine.ts` for the canonical reference.
