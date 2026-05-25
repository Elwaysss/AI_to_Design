# Design Tokens

Three-tier W3C-style design tokens compiled by [Style Dictionary](https://styledictionary.com/).

```
tokens/
├── base/         # Tier 1 — raw values (HEX, px, numbers). Almost never used directly by components.
├── semantic/     # Tier 2 — purpose-driven aliases (color.brand.primary, color.text.muted, ...).
└── components/   # Tier 3 — control-level variants (button.primary.bg, card.shadow.high, ...).
```

## Build

```bash
npm run tokens:build
```

Outputs to `dist/`:

| Path | Consumer |
|---|---|
| `dist/css/variables.css` | Web — imported by `src/app.css` |
| `dist/tailwind/theme.css` | Tailwind v4 `@theme` mapping |
| `dist/js/tokens.js` | Type-safe JS / TS consumers |
| `dist/ios/DesignTokens.swift` | iOS native |
| `dist/android/colors.xml` + `dimens.xml` | Android native |

## Naming rule

CSS variable names are auto-prefixed `--token-*` (e.g. `--token-color-brand-primary`)
so they never collide with Tailwind v4's own `--color-*` / `--font-*` namespaces.

## Rules of consumption

- Components consume **only** semantic or component-tier tokens.
- Adding a base token requires updating `DESIGN.md` § 2 / § 3 in the same PR.
- Removing or renaming a token requires a deprecation period — open an issue first.
