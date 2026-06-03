/**
 * Map awesome-design-md source → AI Design Paradigm SSOT (DESIGN.md + tokens/base/*).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveBrandColors, hexToRgbString, normalizeHex } from './color-utils.mjs';
import { extractBrandYamlTokens, extractTypoExtras } from './brand-yaml-tokens.mjs';
import { getColorMap, getTypographyRoles, parseYaml, splitFrontmatter } from './yaml-lite.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

const SCALE_PX = [12, 14, 16, 20, 25, 31, 39, 49];
const SCALE_KEYS = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];

const DEFAULT_NEUTRALS = {
  '50': '#FAFAF7',
  '100': '#F1F1EB',
  '200': '#E2E2DA',
  '300': '#C9C9BE',
  '500': '#7A7A6F',
  '700': '#3C3C36',
  '900': '#171715'
};

/** @param {string} slug @param {string} sourceName */
export function brandDisplayName(slug, sourceName) {
  if (sourceName) {
    const cleaned = sourceName
      .replace(/-design-analysis$/i, '')
      .replace(/design analysis$/i, '')
      .trim();
    if (cleaned) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/** @param {Record<string, string>} colors @param {string[]} keys */
function pickColor(colors, keys, fallback) {
  for (const k of keys) {
    const v = colors[k];
    if (v && typeof v === 'string' && v.startsWith('#')) return normalizeHex(v);
  }
  return fallback;
}

/** @param {string} fontFamily */
function quoteFontFamily(fontFamily) {
  if (!fontFamily) return "'Inter', system-ui, sans-serif";
  const trimmed = fontFamily.trim();
  if (trimmed.startsWith("'") || trimmed.startsWith('"')) return trimmed;
  const first = trimmed.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  const rest = trimmed.includes(',') ? trimmed.slice(trimmed.indexOf(',')) : ', system-ui, sans-serif';
  return `'${first}'${rest}`;
}

/** @param {string | number | undefined} size */
function parseFontSizePx(size) {
  if (size == null) return null;
  const s = String(size).replace(/px$/i, '').trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** @param {number} px */
function nearestScaleKey(px) {
  let bestIdx = 2;
  let bestDiff = Infinity;
  for (let i = 0; i < SCALE_PX.length; i++) {
    const diff = Math.abs(SCALE_PX[i] - px);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return SCALE_KEYS[bestIdx];
}

/**
 * @param {Record<string, Record<string, string>>} roles
 */
function extractTypography(roles) {
  const body = roles['body-md'] ?? roles.body ?? roles['body-md-medium'] ?? {};
  const display = roles['display-lg'] ?? roles['display-mega'] ?? roles['hero-display'] ?? roles['heading-1'] ?? {};
  const monoRole = roles.mono ?? roles.code ?? roles['code-block'] ?? {};
  const extras = extractTypoExtras(roles);

  const bodyFamily = quoteFontFamily(body.fontFamily ?? 'Inter, system-ui, sans-serif');
  const displayFamily = quoteFontFamily(display.fontFamily ?? body.fontFamily ?? 'Inter Tight, system-ui, sans-serif');
  const monoFamily = quoteFontFamily(monoRole.fontFamily ?? 'JetBrains Mono, ui-monospace, monospace');

  const bodyPx = parseFontSizePx(body.fontSize) ?? 16;
  const displayPx = parseFontSizePx(display.fontSize) ?? 25;

  /** @type {Record<string, number>} */
  const scalePx = {
    xs: 12,
    sm: 14,
    base: bodyPx,
    lg: 20,
    xl: displayPx >= 20 ? displayPx : 25,
    '2xl': 31,
    '3xl': 39,
    '4xl': 49
  };

  if (bodyPx) scalePx.base = bodyPx;
  const bodyKey = nearestScaleKey(bodyPx);
  scalePx[bodyKey] = bodyPx;
  if (displayPx) {
    const displayKey = nearestScaleKey(displayPx);
    scalePx[displayKey] = displayPx;
  }

  return {
    font_family: { display: displayFamily, body: bodyFamily, mono: monoFamily },
    scale_px: scalePx,
    base_size_px: bodyPx,
    letter_spacing_display: display.letterSpacing ?? '-0.02em',
    font_feature_tabular: extras.fontFeatureTabular,
    font_feature_stylistic: extras.fontFeatureStylistic
  };
}

/** @param {string} body @param {string} brandLabel */
function extractDoDont(body, brandLabel) {
  const dos = [];
  const donts = [];

  const doSection = body.match(/###?\s*Do[^\n]*\n([\s\S]*?)(?=###?\s*Don|$)/i);
  const dontSection = body.match(/###?\s*Don['’]?t[^\n]*\n([\s\S]*?)(?=##|$)/i);

  if (doSection) {
    for (const line of doSection[1].split('\n')) {
      const m = line.match(/^[-*]\s+(.+)/);
      if (m) dos.push(m[1].trim());
    }
  }
  if (dontSection) {
    for (const line of dontSection[1].split('\n')) {
      const m = line.match(/^[-*]\s+(.+)/);
      if (m) donts.push(m[1].trim());
    }
  }

  if (!dos.length) {
    dos.push('Reach for an existing token before inventing anything.');
    dos.push(`Use ${brandLabel} primary only for the single most important CTA per view.`);
    dos.push('Reuse `src/machines/*` actors for any flow with ≥ 3 transitions.');
  }
  if (!donts.length) {
    donts.push("Don't fall back to Tailwind's stock palette (`slate-500`, `blue-600`, etc.).");
    donts.push("Don't introduce near-duplicate brand colors outside the token pipeline.");
    donts.push("Don't wire multi-step UI state with ad-hoc local state.");
  }

  return { dos: dos.slice(0, 5), donts: donts.slice(0, 5) };
}

/** @param {string} description @param {number} maxSentences */
function summarySentences(description, maxSentences = 3) {
  if (!description) return '';
  const parts = description.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, maxSentences).join(' ');
}

/** @param {string} hex */
function isDarkHex(hex) {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/** @param {string} body */
function extractProseHexColors(body) {
  /** @type {Record<string, string>} */
  const byLabel = {};
  for (const m of body.matchAll(/\*\*([^*]+)\*\*[^(]*\(`?(#[0-9A-Fa-f]{6})`?\)/gi)) {
    const label = m[1].toLowerCase();
    const hex = normalizeHex(m[2]);
    if (/green|primary|brand accent|cta|accent/.test(label)) byLabel.primary = hex;
    if (/near black|deepest|canvas|background|near-black/.test(label)) byLabel.canvas = hex;
    if (/dark surface|card|container|elevated|paper|mid dark/.test(label)) byLabel.paper = hex;
    if (/\bwhite\b|primary text|text-base/.test(label) && !/near white|off-?white/.test(label)) {
      byLabel.text = hex;
    }
    if (/silver|secondary|muted|inactive/.test(label)) byLabel.muted = hex;
    if (/negative|error|danger/.test(label)) byLabel.danger = hex;
    if (/warning|orange/.test(label)) byLabel.warning = hex;
    if (/announcement|info|blue/.test(label)) byLabel.info = hex;
  }

  const uniq = [
    ...new Set([...body.matchAll(/`(#([0-9A-Fa-f]{6}))`/g)].map((m) => normalizeHex(m[1])))
  ];
  return { byLabel, uniq };
}

/**
 * Fallback mapper for prose-only awesome-design-md entries (e.g. spotify).
 * @param {string} raw
 * @param {string} slug
 */
function mapBrandDesignProse(raw, slug) {
  const sourceBody = raw;
  const { byLabel, uniq } = extractProseHexColors(raw);
  const titleMatch = raw.match(/^#\s+Design System Inspired by\s+(.+?)\s*$/m);
  const displayName = titleMatch ? titleMatch[1].trim() : brandDisplayName(slug, '');
  const productName = `${displayName} Starter`;
  const atmosphereSummary =
    summarySentences(sourceBody.split('\n\n')[1] ?? '') ||
    `${displayName} brand identity imported from awesome-design-md (prose source).`;

  const primary =
    byLabel.primary ??
    uniq.find((h) => /1ED760|1DB954|533AFD|635BFD|FF385C/i.test(h)) ??
    uniq[0] ??
    '#3B82F6';
  const derived = deriveBrandColors(primary);
  const hover = derived.hover;
  const subtle = derived.subtle;

  const canvas =
    byLabel.canvas ?? uniq.find((h) => h.toUpperCase() === '#121212') ?? uniq.find(isDarkHex) ?? '#121212';
  const paper =
    byLabel.paper ??
    uniq.find((h) => h.toUpperCase() === '#181818' || h.toUpperCase() === '#1F1F1F') ??
    '#181818';
  const sunken = canvas;

  const textPrimary = byLabel.text ?? '#FFFFFF';
  const textMuted = byLabel.muted ?? '#B3B3B3';
  const textInverse = isDarkHex(textPrimary) ? '#FAFAF7' : canvas;

  const typography = extractTypography({});
  const { dos, donts } = extractDoDont(sourceBody, displayName);
  const yamlTokens = extractBrandYamlTokens(raw, slug);

  const keywords =
    sourceBody
      .toLowerCase()
      .match(/\b(dark|immersive|minimal|pill|rounded|premium|content-first|monochrome)\b/g) ?? ['brand'];
  const uniqueKeywords = [...new Set(keywords)];

  const mapped = {
    slug,
    displayName,
    productName,
    atmosphereSummary,
    colors: {
      brand: { primary, hover, subtle },
      neutral: { ...DEFAULT_NEUTRALS },
      surface: { canvas, paper, sunken },
      text: {
        primary: textPrimary,
        secondary: textPrimary,
        muted: textMuted,
        inverse: textInverse
      },
      feedback: {
        success: primary,
        warning: byLabel.warning ?? '#C8861B',
        danger: byLabel.danger ?? '#EA2143',
        info: byLabel.info ?? '#2E6CB8'
      }
    },
    typography,
    atmosphere: {
      keywords: uniqueKeywords.slice(0, 6),
      inspiration: [displayName],
      information_density: 'low-to-medium',
      whitespace_bias: 'generous'
    },
    dos,
    donts,
    loginSpecRgb: hexToRgbString(primary),
    layout: yamlTokens.layout,
    elevation: {
      flat: yamlTokens.elevation.flat,
      raised: yamlTokens.elevation.raised,
      high: yamlTokens.elevation.high,
      modal: yamlTokens.elevation.modal
    }
  };

  return {
    mapped,
    designMd: buildDesignMd(mapped),
    colorJson: buildColorJson(mapped),
    typographyJson: buildTypographyJson(mapped),
    spacingJson: yamlTokens.spacing.spacingJson,
    elevationJson: yamlTokens.elevation.elevationJson
  };
}

/**
 * @param {string} raw
 * @param {string} slug
 */
export function mapBrandDesign(raw, slug) {
  const { yaml, body: sourceBody } = splitFrontmatter(raw);
  if (!yaml) return mapBrandDesignProse(raw, slug);

  const data = parseYaml(yaml);
  const srcColors = getColorMap(data);
  const typoRoles = getTypographyRoles(data);

  const displayName = brandDisplayName(slug, String(data.name ?? ''));
  const productName = `${displayName} Starter`;
  const description = String(data.description ?? '');
  const atmosphereSummary = summarySentences(description) || `${displayName} brand identity imported from awesome-design-md.`;

  const primary = pickColor(srcColors, ['primary'], '#B8422E');
  const derived = deriveBrandColors(primary);
  const hover = pickColor(srcColors, ['primary-pressed', 'primary-active', 'primary-deep'], derived.hover);
  const subtle = derived.subtle;

  const canvas = pickColor(srcColors, ['canvas', 'canvas-soft'], '#FAFAF7');
  let paper = pickColor(srcColors, ['surface-card', 'surface-1', 'surface-2', 'surface-3', 'surface', 'paper'], '#FFFFFF');
  if (isDarkHex(canvas) && !isDarkHex(paper)) {
    paper = pickColor(srcColors, ['surface-1', 'surface-2', 'surface-3', 'surface-4'], '#0F1011');
  }
  const sunken = pickColor(srcColors, ['surface-soft', 'surface-strong', 'hairline-soft'], canvas);

  const textPrimary = pickColor(srcColors, ['ink', 'charcoal', 'ink-deep', 'body-strong'], '#171715');
  const textSecondary = pickColor(srcColors, ['body', 'slate'], textPrimary);
  const textMuted = pickColor(srcColors, ['muted', 'stone', 'steel', 'muted-soft'], '#7A7A6F');
  const textInverse = pickColor(srcColors, ['on-dark', 'on-primary', 'canvas'], '#FAFAF7');

  const success = pickColor(srcColors, ['semantic-success', 'brand-green'], '#2F7D52');
  const warning = pickColor(srcColors, ['semantic-warning', 'brand-orange'], '#C8861B');
  const danger = pickColor(srcColors, ['semantic-error', 'danger'], primary);
  const info = pickColor(srcColors, ['link-blue', 'semantic-info', 'brand-teal'], '#2E6CB8');

  const neutrals = { ...DEFAULT_NEUTRALS };
  if (srcColors['50']) neutrals['50'] = normalizeHex(srcColors['50']);
  if (srcColors['100']) neutrals['100'] = normalizeHex(srcColors['100']);
  if (srcColors.hairline) neutrals['200'] = normalizeHex(srcColors.hairline);
  if (srcColors.hairline_soft) neutrals['200'] = normalizeHex(srcColors.hairline_soft);

  const typography = extractTypography(typoRoles);
  const { dos, donts } = extractDoDont(sourceBody, displayName);
  const yamlTokens = extractBrandYamlTokens(raw, slug);

  const keywords = description
    .toLowerCase()
    .match(/\b(minimal|warm|editorial|confident|precise|calm|high-contrast|monochrome|illustration|developer|gallery|architectural)\b/g);
  const uniqueKeywords = [...new Set(keywords ?? ['brand', 'minimal'])];

  const mapped = {
    slug,
    displayName,
    productName,
    atmosphereSummary,
    colors: {
      brand: { primary, hover, subtle },
      neutral: neutrals,
      surface: { canvas, paper, sunken },
      text: { primary: textPrimary, secondary: textSecondary, muted: textMuted, inverse: textInverse },
      feedback: { success, warning, danger, info }
    },
    typography,
    atmosphere: {
      keywords: uniqueKeywords.slice(0, 6),
      inspiration: [displayName],
      information_density: 'low-to-medium',
      whitespace_bias: 'generous'
    },
    dos,
    donts,
    loginSpecRgb: hexToRgbString(primary),
    layout: yamlTokens.layout,
    elevation: {
      flat: yamlTokens.elevation.flat,
      raised: yamlTokens.elevation.raised,
      high: yamlTokens.elevation.high,
      modal: yamlTokens.elevation.modal
    }
  };

  return {
    mapped,
    designMd: buildDesignMd(mapped),
    colorJson: buildColorJson(mapped),
    typographyJson: buildTypographyJson(mapped),
    spacingJson: yamlTokens.spacing.spacingJson,
    elevationJson: yamlTokens.elevation.elevationJson
  };
}

/** @param {ReturnType<typeof mapBrandDesign>['mapped']} m */
function buildDesignMd(m) {
  const fm = `---
# ============================================================
#  DESIGN.md — Single Source of Truth
#  Spec version : 1.0
#  Last updated : ${new Date().toISOString().slice(0, 10)}
#  Maintainers  : @org/design-ops
#  Imported from: awesome-design-md/${m.slug}
# ============================================================

meta:
  name: "${m.productName}"
  version: "0.1.0"
  theme: "${m.displayName} Brand"
  density: "comfortable"

atmosphere:
  keywords: ${JSON.stringify(m.atmosphere.keywords)}
  inspiration: ${JSON.stringify(m.atmosphere.inspiration)}
  information_density: "${m.atmosphere.information_density}"
  whitespace_bias: "${m.atmosphere.whitespace_bias}"

colors:
  brand:
    primary:        "${m.colors.brand.primary}"   # ${m.displayName} — primary CTA driver
    primary-hover:  "${m.colors.brand.hover}"
    primary-subtle: "${m.colors.brand.subtle}"
  neutral:
    "50":  "${m.colors.neutral['50']}"
    "100": "${m.colors.neutral['100']}"
    "200": "${m.colors.neutral['200']}"
    "300": "${m.colors.neutral['300']}"
    "500": "${m.colors.neutral['500']}"
    "700": "${m.colors.neutral['700']}"
    "900": "${m.colors.neutral['900']}"
  surface:
    canvas:  "${m.colors.surface.canvas}"
    paper:   "${m.colors.surface.paper}"
    sunken:  "${m.colors.surface.sunken}"
  text:
    primary:   "${m.colors.text.primary}"
    secondary: "${m.colors.text.secondary}"
    muted:     "${m.colors.text.muted}"
    inverse:   "${m.colors.text.inverse}"
  feedback:
    success: "${m.colors.feedback.success}"
    warning: "${m.colors.feedback.warning}"
    danger:  "${m.colors.feedback.danger}"
    info:    "${m.colors.feedback.info}"

typography:
  font_family:
    display: ${m.typography.font_family.display}
    body:    ${m.typography.font_family.body}
    mono:    ${m.typography.font_family.mono}
  scale_ratio: 1.25
  base_size_px: ${m.typography.base_size_px}
  scale_px:
    xs:   ${m.typography.scale_px.xs}
    sm:   ${m.typography.scale_px.sm}
    base: ${m.typography.scale_px.base}
    lg:   ${m.typography.scale_px.lg}
    xl:   ${m.typography.scale_px.xl}
    "2xl": ${m.typography.scale_px['2xl']}
    "3xl": ${m.typography.scale_px['3xl']}
    "4xl": ${m.typography.scale_px['4xl']}
  line_height:
    tight:  1.15
    normal: 1.50
    loose:  1.75
  letter_spacing:
    display: "${m.typography.letter_spacing_display ?? '-0.02em'}"
    body:    "0"

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

layout:
  spacing_base_px: ${m.layout?.spacing_base_px ?? 4}
  spacing_scale_px: ${JSON.stringify(m.layout?.spacing_scale_px ?? [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128])}
  container_max_px: ${m.layout?.container_max_px ?? 1280}
  grid_columns: ${m.layout?.grid_columns ?? 12}
  grid_gutter_px: ${m.layout?.grid_gutter_px ?? 24}

elevation:
  flat:   "${m.elevation?.flat ?? '0 0 0 1px rgba(23,23,21,0.06)'}"
  raised: "${m.elevation?.raised ?? '0 1px 2px rgba(23,23,21,0.06), 0 1px 3px rgba(23,23,21,0.10)'}"
  high:   "${m.elevation?.high ?? '0 12px 32px -8px rgba(23,23,21,0.18)'}"
  modal:  "${m.elevation?.modal ?? '0 32px 64px -16px rgba(23,23,21,0.28)'}"

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
---`;

  const doList = m.dos.map((d) => `- ${d}`).join('\n');
  const dontList = m.donts.map((d) => `- ${d}`).join('\n');

  const body = `
# ${m.productName} — \`DESIGN.md\`

> **Hard rule for AI agents**: the YAML block above is *binding*. The prose below tells you
> *why* and *when*. Never invent a new HEX, font size, or spacing unit; always reference
> a token from \`tokens/**\`.

---

## 1. Visual Theme & Atmosphere

${m.atmosphereSummary}

Translate this when generating:

- Default to generous padding (\`spacing.6\` / \`spacing.8\`) over dense grids.
- Prefer monochrome neutrals + one accent (${m.displayName} primary) over multi-color palettes.
- Avoid skeuomorphic shadows; lean on \`elevation.flat\` and \`elevation.raised\`.
- Strong information hierarchy through type size, not color saturation.

## 2. Color Palette & Roles

Each color has a **role**, not a name. AI MUST select by role:

| Role | Token | When to use |
|---|---|---|
| Primary action | \`color.brand.primary\` | THE one button per view that drives the goal |
| Secondary surface | \`color.surface.paper\` | Cards, panels, sheets |
| Page canvas | \`color.surface.canvas\` | Body background |
| Body text | \`color.text.primary\` | Default paragraph & control labels |
| Muted text | \`color.text.muted\` | Helper text, timestamps, captions |
| Destructive | \`color.feedback.danger\` | Delete / irreversible actions |

> **Never** use raw neutrals for brand interaction. ${m.displayName} primary (${m.colors.brand.primary}) is reserved for
> primary CTAs — using it on a dozen buttons destroys its meaning.

WCAG: every text / background pair MUST clear **AA (4.5:1 for body, 3:1 for ≥24 px)**.
The CI workflow \`.github/workflows/design-validate.yml\` enforces this.

## 3. Typography Rules

- Display sizes (\`xl\` and up) use \`font.family.display\` with tighter letter spacing.
- Body and form controls use \`font.family.body\`.
- Code, IDs, and tabular numerics use \`font.family.mono\`.
- Never set a font size that isn't in \`typography.scale_px\`.
- Line-height = \`tight\` for display, \`normal\` for body, \`loose\` for long-form reading.

## 4. Component Stylings

Component anatomies live in \`tokens/components/*.json\`. AI MUST consume them via
CSS variables emitted by Style Dictionary — never inline values.

States every interactive component must define:
\`default · hover · active · focus-visible · disabled · loading\`.

Focus ring: 2 px outer ring in \`color.brand.primary\` with 2 px offset.

## 5. Layout Principles

- The 4 px base unit is sacred. Any spacing must come from \`layout.spacing_scale_px\`.
- Max content width = 1280 px, 12-column grid, 24 px gutter.
- Section vertical rhythm: \`spacing.16\` (64 px) between major blocks on \`lg+\`,
  collapsing to \`spacing.8\` (32 px) on \`sm\`.

## 6. Depth & Elevation

Use elevation sparingly to encode *interaction layer*, not "prettiness":

| Layer | Token |
|---|---|
| Inline surface | \`elevation.flat\` |
| Cards, list rows on hover | \`elevation.raised\` |
| Popovers, dropdowns | \`elevation.high\` |
| Modals, drawers | \`elevation.modal\` |

## 7. Do's and Don'ts

### Do
${doList}

### Don't
${dontList}

## 8. Responsive Behavior

- Mobile-first authoring; layouts expand at \`md\` and \`lg\`.
- Minimum touch target = 44 × 44 px (see \`responsive.min_touch_target_px\`).
- Stack two-column layouts to single column below \`md\`.
- Test every screen at the breakpoints listed above before merging.

## 9. Agent Prompt Guide

Drop the following directly into Cursor / Claude Code as a system / pre-prompt
when starting a new component.

\`\`\`text
You are generating a Vue 3 + Tailwind v4 component for ${m.productName}.

Hard requirements:
- Read DESIGN.md and the relevant files under tokens/.
- Use ONLY CSS variables defined by Style Dictionary (prefix --token-*) and Tailwind
  utilities derived from the @theme block in src/style.css.
- If the flow has 3+ transitions, define / extend an XState machine in src/machines/
  and bind via @xstate/vue useMachine.
- Ship: SFC component file, story (if Storybook present), Playwright spec under tests/e2e/.
- Forbidden: raw HEX, arbitrary px values, stock Tailwind colors, ad-hoc ref/useState
  for multi-step flows.
\`\`\`
`;

  return `${fm}\n${body.trimStart()}\n`;
}

/** @param {ReturnType<typeof mapBrandDesign>['mapped']} m */
function buildColorJson(m) {
  return {
    color: {
      base: {
        clay: {
          '300': {
            value: m.colors.brand.subtle,
            type: 'color',
            comment: `${m.displayName} — primary subtle / hover-up`
          },
          '500': {
            value: m.colors.brand.primary,
            type: 'color',
            comment: `${m.displayName} — brand primary driver (imported via design:from)`
          },
          '700': {
            value: m.colors.brand.hover,
            type: 'color',
            comment: `${m.displayName} — primary pressed / hover`
          }
        },
        ink: {
          '50': { value: m.colors.neutral['50'], type: 'color' },
          '100': { value: m.colors.neutral['100'], type: 'color' },
          '200': { value: m.colors.neutral['200'], type: 'color' },
          '300': { value: m.colors.neutral['300'], type: 'color' },
          '500': { value: m.colors.neutral['500'], type: 'color' },
          '700': { value: m.colors.neutral['700'], type: 'color' },
          '900': { value: m.colors.neutral['900'], type: 'color' }
        },
        moss: { value: m.colors.feedback.success, type: 'color', comment: 'Feedback / success' },
        amber: { value: m.colors.feedback.warning, type: 'color', comment: 'Feedback / warning' },
        lake: { value: m.colors.feedback.info, type: 'color', comment: 'Feedback / info' }
      }
    }
  };
}

/** @param {ReturnType<typeof mapBrandDesign>['mapped']} m */
function buildTypographyJson(m) {
  return {
    font: {
      family: {
        display: { value: m.typography.font_family.display, type: 'fontFamily' },
        body: { value: m.typography.font_family.body, type: 'fontFamily' },
        mono: { value: m.typography.font_family.mono, type: 'fontFamily' }
      },
      size: {
        xs: { value: `${m.typography.scale_px.xs}px`, type: 'dimension' },
        sm: { value: `${m.typography.scale_px.sm}px`, type: 'dimension' },
        base: { value: `${m.typography.scale_px.base}px`, type: 'dimension' },
        lg: { value: `${m.typography.scale_px.lg}px`, type: 'dimension' },
        xl: { value: `${m.typography.scale_px.xl}px`, type: 'dimension' },
        '2xl': { value: `${m.typography.scale_px['2xl']}px`, type: 'dimension' },
        '3xl': { value: `${m.typography.scale_px['3xl']}px`, type: 'dimension' },
        '4xl': { value: `${m.typography.scale_px['4xl']}px`, type: 'dimension' }
      },
      weight: {
        regular: { value: '400', type: 'fontWeight' },
        medium: { value: '500', type: 'fontWeight' },
        semibold: { value: '600', type: 'fontWeight' },
        bold: { value: '700', type: 'fontWeight' }
      },
      'line-height': {
        tight: { value: '1.15', type: 'number' },
        normal: { value: '1.50', type: 'number' },
        loose: { value: '1.75', type: 'number' }
      },
      'letter-spacing': {
        display: { value: m.typography.letter_spacing_display ?? '-0.02em', type: 'dimension' },
        body: { value: '0', type: 'dimension' }
      }
    }
  };
}

/**
 * Patch login.spec.ts RGB assertion.
 * @param {string} primaryHex
 * @param {string} specContent
 */
export function patchLoginSpecContent(specContent, primaryHex) {
  const rgb = hexToRgbString(primaryHex);
  let spec = specContent;
  spec = spec.replace(/expect\(bg\)\.toBe\('rgb\([^']+\)'\);/, `expect(bg).toBe('${rgb}');`);
  spec = spec.replace(/\/\/ #[0-9A-Fa-f]{6}[^\n]*/, `// ${primaryHex} — clay.500 after design:from`);
  return spec;
}

/** Load starter template DESIGN.md for reference (unused at runtime but available). */
export async function loadStarterDesignMd() {
  return readFile(path.join(ROOT, 'DESIGN.md'), 'utf8');
}
