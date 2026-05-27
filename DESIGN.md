---
# ============================================================
#  DESIGN.md — Single Source of Truth
#  Spec version : 1.0
#  Last updated : 2026-05-25
#  Maintainers  : @org/design-ops
# ============================================================
#
#  YAML frontmatter = MACHINE-READABLE hard data (HEX / px / numbers).
#  Markdown body    = HUMAN-READABLE intent, atmosphere, do/don't.
#
#  All AI agents MUST read this file before generating any UI.
# ============================================================

meta:
  name: "AI Design Paradigm Starter"
  version: "0.1.0"
  theme: "Architectural Minimalism"
  density: "comfortable"

# ── 1. Visual Theme & Atmosphere (machine snapshot) ─────────
atmosphere:
  keywords: ["architectural", "minimal", "high-contrast", "gallery"]
  inspiration: ["Notion (calm minimalism)", "Linear (monochrome precision)"]
  information_density: "low-to-medium"
  whitespace_bias: "generous"

# ── 2. Color Palette & Roles ────────────────────────────────
colors:
  brand:
    primary:        "#B8422E"   # Boston Clay — the ONLY driver of primary CTAs
    primary-hover:  "#7E2A1C"
    primary-subtle: "#D9614A"
  neutral:
    "50":  "#FAFAF7"
    "100": "#F1F1EB"
    "200": "#E2E2DA"
    "300": "#C9C9BE"
    "500": "#7A7A6F"
    "700": "#3C3C36"
    "900": "#171715"
  surface:
    canvas:  "#FAFAF7"
    paper:   "#FFFFFF"
    sunken:  "#F1F1EB"
  text:
    primary:   "#171715"
    secondary: "#3C3C36"
    muted:     "#7A7A6F"
    inverse:   "#FAFAF7"
  feedback:
    success: "#2F7D52"
    warning: "#C8861B"
    danger:  "#B8422E"
    info:    "#2E6CB8"

# ── 3. Typography ───────────────────────────────────────────
typography:
  font_family:
    display: "'Inter Tight', system-ui, sans-serif"
    body:    "'Inter', system-ui, sans-serif"
    mono:    "'JetBrains Mono', ui-monospace, monospace"
  scale_ratio: 1.25          # Major Third
  base_size_px: 16
  scale_px:
    xs:   12
    sm:   14
    base: 16
    lg:   20
    xl:   25
    "2xl": 31
    "3xl": 39
    "4xl": 49
  line_height:
    tight:  1.15
    normal: 1.50
    loose:  1.75
  letter_spacing:
    display: "-0.02em"
    body:    "0"

# ── 4. Component Stylings (top-line only — full spec in /tokens/components/) ──
components:
  button:
    height_px:  { sm: 32, md: 40, lg: 48 }
    radius_px:  6
    padding_x_px: { sm: 12, md: 16, lg: 24 }
  input:
    height_px:  40
    radius_px:  6
    border_px:  1
  card:
    radius_px:  12
    padding_px: 24
  navbar:
    height_px:  64

# ── 5. Layout ───────────────────────────────────────────────
layout:
  spacing_base_px: 4
  spacing_scale_px: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  container_max_px: 1280
  grid_columns: 12
  grid_gutter_px: 24

# ── 6. Depth & Elevation ────────────────────────────────────
elevation:
  flat:   "0 0 0 1px rgba(23,23,21,0.06)"
  raised: "0 1px 2px rgba(23,23,21,0.06), 0 1px 3px rgba(23,23,21,0.10)"
  high:   "0 12px 32px -8px rgba(23,23,21,0.18)"
  modal:  "0 32px 64px -16px rgba(23,23,21,0.28)"

# ── 8. Responsive ───────────────────────────────────────────
responsive:
  breakpoints_px:
    sm: 640
    md: 768
    lg: 1024
    xl: 1280
    "2xl": 1536
  min_touch_target_px: 44
  content_fold:
    sm: "stack-all"
    md: "stack-sidebar"
    lg: "two-column"
---

# AI Design Paradigm — `DESIGN.md`

> **Hard rule for AI agents**: the YAML block above is *binding*. The prose below tells you
> *why* and *when*. Never invent a new HEX, font size, or spacing unit; always reference
> a token from `tokens/**`.

---

## 1. Visual Theme & Atmosphere

We aim for **architectural minimalism**: large negative space, structural lines,
quietly confident typography, and a single warm accent color (Boston Clay) that
draws the eye to the *one* action that matters on the page.

Translate this when generating:

- Default to generous padding (`spacing.6` / `spacing.8`) over dense grids.
- Prefer monochrome neutrals + one accent over multi-color palettes.
- Avoid skeuomorphic shadows; lean on `elevation.flat` and `elevation.raised`.
- Strong information hierarchy through type size, not color saturation.

## 2. Color Palette & Roles

Each color has a **role**, not a name. AI MUST select by role:

| Role | Token | When to use |
|---|---|---|
| Primary action | `color.brand.primary` | THE one button per view that drives the goal |
| Secondary surface | `color.surface.paper` | Cards, panels, sheets |
| Page canvas | `color.surface.canvas` | Body background |
| Body text | `color.text.primary` | Default paragraph & control labels |
| Muted text | `color.text.muted` | Helper text, timestamps, captions |
| Destructive | `color.feedback.danger` | Delete / irreversible actions |

> **Never** use raw neutrals for brand interaction. Boston Clay is reserved for
> primary CTAs — using it on a dozen buttons destroys its meaning.

WCAG: every text / background pair MUST clear **AA (4.5:1 for body, 3:1 for ≥24 px)**.
The CI workflow `.github/workflows/design-validate.yml` enforces this.

## 3. Typography Rules

- Display sizes (`xl` and up) use `font.family.display` with tighter letter spacing.
- Body and form controls use `font.family.body`.
- Code, IDs, and tabular numerics use `font.family.mono`.
- Never set a font size that isn't in `typography.scale_px`.
- Line-height = `tight` for display, `normal` for body, `loose` for long-form reading.

## 4. Component Stylings

Component anatomies live in `tokens/components/*.json`. AI MUST consume them via
CSS variables emitted by Style Dictionary — never inline values.

States every interactive component must define:
`default · hover · active · focus-visible · disabled · loading`.

Focus ring: 2 px outer ring in `color.brand.primary` with 2 px offset.

## 5. Layout Principles

- The 4 px base unit is sacred. Any spacing must come from `layout.spacing_scale_px`.
- Max content width = 1280 px, 12-column grid, 24 px gutter.
- Section vertical rhythm: `spacing.16` (64 px) between major blocks on `lg+`,
  collapsing to `spacing.8` (32 px) on `sm`.

## 6. Depth & Elevation

Use elevation sparingly to encode *interaction layer*, not "prettiness":

| Layer | Token |
|---|---|
| Inline surface | `elevation.flat` |
| Cards, list rows on hover | `elevation.raised` |
| Popovers, dropdowns | `elevation.high` |
| Modals, drawers | `elevation.modal` |

## 7. Do's and Don'ts

### Do
- Reach for an existing token before inventing anything.
- Use a single primary action per view.
- Reuse `src/machines/*` actors for any flow with ≥ 3 transitions.

### Don't
- Don't fall back to Tailwind's stock palette (`slate-500`, `blue-600`, etc.).
- Don't introduce "almost-the-same" colors (e.g. `#B7422E` vs `#B8422E`).
- Don't create one-off shadows, radii, or font sizes inside a component file.
- Don't wire multi-step UI state with ad-hoc `useState`.

## 8. Responsive Behavior

- Mobile-first authoring; layouts expand at `md` and `lg`.
- Minimum touch target = 44 × 44 px (see `responsive.min_touch_target_px`).
- Stack two-column layouts to single column below `md`.
- Test every screen at the breakpoints listed above before merging.

## 9. Agent Prompt Guide

Drop the following directly into Cursor / Claude Code as a system / pre-prompt
when starting a new component.

```text
You are generating a Vue 3 + Tailwind v4 component for the AI Design Paradigm Starter.

Hard requirements:
- Read DESIGN.md and the relevant files under tokens/.
- Use ONLY CSS variables defined by Style Dictionary (prefix --token-*) and Tailwind
  utilities derived from the @theme block in src/style.css.
- If the flow has 3+ transitions, define / extend an XState machine in src/machines/
  and bind via @xstate/vue useMachine.
- Ship: SFC component file, story (if Storybook present), Playwright spec under tests/e2e/.
- Forbidden: raw HEX, arbitrary px values, stock Tailwind colors, ad-hoc ref/useState
  for multi-step flows.
```
