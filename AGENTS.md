# Agent Instructions

You are an AI coding agent (Cursor / Claude Code / Codex / Stitch / any MCP-capable agent)
operating in this repository.

## Single Source of Truth

Before generating, editing, or reviewing any UI or business-logic code, you **MUST**:

1. Read `DESIGN.md` at the repo root in full.
2. Treat its **YAML frontmatter** as binding hard data (HEX, spacing, scale, breakpoints).
3. Treat its **Markdown body** as the authoritative *why* — intent, atmosphere, do/don't.
4. Read any relevant file under `tokens/` (base / semantic / components).
5. Read any relevant actor under `src/machines/` before wiring an interactive flow.

## Hard Rules

- **NEVER** introduce raw HEX colors, font sizes, or spacing values in components.
  Always reference tokens — Tailwind v4 utilities derived from the `@theme`
  block in `src/style.css` (e.g. `bg-brand-primary`, `text-display-lg`,
  `rounded-md`) or the underlying CSS variables
  (e.g. `var(--token-color-brand-primary)`).
- **NEVER** default to Tailwind's stock palette (slate / blue / gray-500 etc.).
- **NEVER** introduce a new component variant without first writing it into
  `DESIGN.md` § 4 and `tokens/components/`.
- **NEVER** wire multi-step UI state with ad-hoc local state (Vue `ref` for
  flow state, React `useState`, etc.). Use `src/machines/` + the appropriate
  framework binding:
    - Vue 3 → `@xstate/vue`'s `useMachine` / `useActor`
    - React → `@xstate/react`'s `useMachine` / `useActor`
    - Svelte → `@xstate/svelte`
  This project currently ships **Vue 3 + TypeScript**.
- All commits to `DESIGN.md` or `tokens/**` go through Pull Request review.
  CI will block PRs that fail `design.md validate` or introduce token diffs without
  reviewer approval (see `.github/workflows/`).

## Component Generation Workflow

1. Re-read `DESIGN.md` § 1, § 2, § 3, § 4 — confirm theme, palette, type, component norms.
2. Identify which existing tokens satisfy the request.
3. If a needed token is missing → propose adding it to `tokens/` first,
   then implement the component.
4. Wire interactions through an `src/machines/` actor whenever state has ≥ 3 transitions.
5. Ship together: component file + Playwright spec in `tests/e2e/` + any new tokens.

## Test Expectations

- Every new screen ships with at least one Playwright spec under `tests/e2e/`.
- Visual regression baselines live in Chromatic; never hand-edit snapshot files.
- When a locator fails, prefer letting the Playwright Healer agent propose a fix
  via PR rather than silently rewriting selectors.

## MCP Servers (recommended)

If running inside Cursor or Claude Code with MCP enabled, you should have access to:

- **Mermaid MCP** — validate-and-render state graphs against `src/machines/` actors.
- **Playwright Test Agents** — Planner / Generator / Healer.
- **Style Dictionary CLI** — build & inspect compiled tokens.

Use them rather than re-inventing parsers / linters in code.
