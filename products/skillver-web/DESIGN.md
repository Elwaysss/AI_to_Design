---
meta:
  name: "Skillver Web"
  version: "2.1.1"
  spec: "V2.1 Canonical + Neumorphism skin"
  skin: "glassmorphism-pro"
  density: "comfortable"

colors:
  primary: "#1856FF"
  primary_hover: "#1243C9"
  surface: "rgba(255,255,255,0.1)"
  background: "#0C1222"
  glass_blur_px: 24
  glass_blur_strong_px: 32
  reference: "awesome-design-skills/glassmorphism — pro mesh + luminous border"
  text_body: "#1E2938"

typography:
  body_pt: "10-11pt"
  line_height: "1.15-1.25"
  h1_pt: "18-22pt"
  h2_pt: "13-15pt"
  h3_pt: "12pt"

layout:
  sidebar_talent_px: 288
  sidebar_enterprise_px: 240
  radius_card_px: 12
  radius_button_px: 8
---

# Skillver V2.1 — DESIGN.md

**Skin:** Glassmorphism Pro — gradient mesh bg, `glass-panel` / `glass-input` / `glass-nav-active` (blur 24–32px, luminous border). Primary `#1856FF`.

Canonical flow/layout from **V2.1 白皮书** (`docs/phase4/skillver/V2.1-CANONICAL.md`).

## Tokens (CSS → Tailwind v4 `@theme`)

| Token | Variable | Tailwind |
|-------|----------|----------|
| Primary | `--color-primary` | `bg-primary`, `text-primary` |
| Surface | `--color-surface` | `bg-surface` |
| Background | `--color-background` | `bg-background` |
| Status | `--color-status-*` | `text-status-success`, etc. |

Sidebars: `w-sidebar-talent` (288px), `w-sidebar-enterprise` (240px).

## Typography

- Body: `text-sm` / `text-base`, `#1f2937`, `leading-[1.2]`
- `sv-h1`, `sv-h2` (left 4px primary bar), `sv-h3` (italic muted)

## Shells

| Shell | Width | Nav |
|-------|-------|-----|
| TalentWorkbenchSidebar | 288px | 4 items + session slot on `/talent` only |
| EnterpriseSidebar | 240px | 3 items; default route = 招聘助手 Copilot |
| Console | — | Dashboard tables, no Copilot |

**No `target="_blank"`** on in-app navigation.

## Card modes (`InteractiveCardWrapper`)

- `inline` ~50% chat width
- `overlay` drawer + `bg-black/40 backdrop-blur-sm`
- `full` 100% main column (sub-routes)

## Agent guide

Read `docs/phase4/skillver/V2.1-CANONICAL.md`. Map verification to 6 variants (Empty → LOCK). Communications tabs lock per interview state matrix.
