/**
 * Map awesome-design-skills SKILL.md → AI Design Paradigm SSOT (DESIGN.md + tokens/base/*).
 */
import { deriveBrandColors, normalizeHex } from './color-utils.mjs';
import { normalizePreviewVars } from './preview-color-normalize.mjs';

const DEFAULT_NEUTRALS = {
  '50': '#FAFAF7',
  '100': '#F1F1EB',
  '200': '#E2E2DA',
  '300': '#C9C9BE',
  '500': '#7A7A6F',
  '700': '#3C3C36',
  '900': '#171715'
};

/** @param {string} raw */
function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { yaml: '', body: raw };
  return { yaml: match[1], body: match[2] };
}

/** @param {string} yaml */
function parseYamlNameDescription(yaml) {
  const name = yaml.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const description = yaml.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
  return { name, description };
}

/** @param {string} body */
function extractStyleFoundations(body) {
  const section = body.match(/## Style Foundations\r?\n([\s\S]*?)(?=\r?\n## |\r?\n<!--|$)/i);
  const text = section?.[1] ?? body;

  const tokensLine = text.match(/Tokens:\s*([^\n]+)/i)?.[1] ?? '';
  /** @type {Record<string, string>} */
  const tokens = {};
  for (const part of tokensLine.split(',')) {
    const m = part.trim().match(/^([\w-]+)=#?([0-9A-Fa-f]{6})/);
    if (m) tokens[m[1].toLowerCase()] = normalizeHex(`#${m[2]}`);
  }

  const fontsLine = text.match(/Fonts:\s*([^\n|]+)/i)?.[1] ?? '';
  /** @type {Record<string, string>} */
  const fonts = {};
  for (const part of fontsLine.split(',')) {
    const m = part.trim().match(/^(primary|display|mono)=([^,]+)/i);
    if (m) fonts[m[1].toLowerCase()] = m[2].trim();
  }

  const visualLine = text.match(/Visual style:\s*([^\n]+)/i)?.[1] ?? '';
  const visualStyle = visualLine.split(',').map((s) => s.trim()).filter(Boolean);

  const scaleLine = text.match(/Typography scale:\s*([^\n|]+)/i)?.[1] ?? '';
  const scalePx = scaleLine
    .split(/[/,]/)
    .map((s) => parseInt(s.replace(/px/i, '').trim(), 10))
    .filter((n) => Number.isFinite(n));

  return { tokens, fonts, visualStyle, scalePx };
}

/** @param {string} body */
function extractDoDont(body) {
  const dos = [];
  const donts = [];
  const doSection = body.match(/## Rules: Do\r?\n([\s\S]*?)(?=## Rules: Don|$)/i);
  const dontSection = body.match(/## Rules: Don't\r?\n([\s\S]*?)(?=## |$)/i);

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

  return {
    dos: dos.length ? dos.slice(0, 5) : ['Prefer semantic tokens over raw values.', 'Preserve visual hierarchy.'],
    donts: donts.length
      ? donts.slice(0, 5)
      : ["Don't use stock Tailwind palette colors.", "Don't hardcode HEX in components."]
  };
}

/** @param {string} fontFamily */
function quoteFontFamily(fontFamily) {
  if (!fontFamily) return "'Inter', system-ui, sans-serif";
  const trimmed = fontFamily.trim();
  if (trimmed.startsWith("'") || trimmed.startsWith('"')) return trimmed;
  return `'${trimmed.split(',')[0].trim()}'${trimmed.includes(',') ? trimmed.slice(trimmed.indexOf(',')) : ', system-ui, sans-serif'}`;
}

/** @param {string} hex */
function isDark(hex) {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/**
 * @param {string} raw SKILL.md content
 * @param {string} slug
 * @param {string} [displayNameZh]
 */
export function mapSkillDesign(raw, slug, displayNameZh) {
  const { yaml, body } = splitFrontmatter(raw);
  const meta = parseYamlNameDescription(yaml);
  const foundations = extractStyleFoundations(body);
  const { dos, donts } = extractDoDont(body);

  const displayName = displayNameZh || meta.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const productName = `Demo SaaS — ${displayName}`;
  const atmosphereSummary =
    meta.description || `${displayName} aesthetic imported from awesome-design-skills/${slug}.`;

  const primary = foundations.tokens.primary ?? '#3B82F6';
  const derived = deriveBrandColors(primary);
  const hover = foundations.tokens['primary-pressed'] ?? foundations.tokens.secondary ?? derived.hover;
  const subtle = derived.subtle;

  const surfaceToken = foundations.tokens.surface ?? '#FFFFFF';
  const darkTheme = foundations.visualStyle.some((v) => /dark|neon|cyber|cosmic|matrix|futuristic/i.test(v))
    || isDark(surfaceToken);

  const canvas = darkTheme ? (foundations.tokens.background ?? '#0F172A') : '#FAFAF7';
  const paper = darkTheme ? (foundations.tokens.surface ?? '#1E293B') : surfaceToken;
  const sunken = darkTheme ? '#0B1220' : '#F1F1EB';

  const textPrimary = foundations.tokens.text ?? (darkTheme ? '#F1F5F9' : '#171715');
  const textMuted = darkTheme ? '#94A3B8' : '#7A7A6F';

  const bodyFont = quoteFontFamily(foundations.fonts.primary ?? 'Inter');
  const displayFont = quoteFontFamily(foundations.fonts.display ?? foundations.fonts.primary ?? 'Inter Tight');
  const monoFont = quoteFontFamily(foundations.fonts.mono ?? 'JetBrains Mono');

  const basePx = foundations.scalePx[2] ?? 16;
  const xlPx = foundations.scalePx[4] ?? 25;

  const mapped = {
    slug,
    displayName,
    productName,
    atmosphereSummary,
    visualStyle: foundations.visualStyle,
    colors: {
      brand: { primary, hover: normalizeHex(hover), subtle },
      neutral: { ...DEFAULT_NEUTRALS },
      surface: { canvas, paper, sunken },
      text: { primary: textPrimary, secondary: textPrimary, muted: textMuted, inverse: darkTheme ? '#0F172A' : '#FAFAF7' },
      feedback: {
        success: foundations.tokens.success ?? '#2F7D52',
        warning: foundations.tokens.warning ?? '#C8861B',
        danger: foundations.tokens.danger ?? primary,
        info: foundations.tokens.info ?? foundations.tokens.secondary ?? '#2E6CB8'
      }
    },
    typography: {
      font_family: { display: displayFont, body: bodyFont, mono: monoFont },
      scale_px: { xs: 12, sm: 14, base: basePx, lg: 20, xl: xlPx, '2xl': 31, '3xl': 39, '4xl': 49 },
      base_size_px: basePx
    },
    atmosphere: {
      keywords: foundations.visualStyle.slice(0, 6).length
        ? foundations.visualStyle.slice(0, 6)
        : ['aesthetic', 'modern'],
      inspiration: [displayName],
      information_density: 'low-to-medium',
      whitespace_bias: 'generous'
    },
    dos,
    donts
  };

  return {
    mapped,
    designMd: buildDesignMd(mapped),
    colorJson: buildColorJson(mapped),
    typographyJson: buildTypographyJson(mapped)
  };
}

/** @param {ReturnType<typeof mapSkillDesign>['mapped']} mapped @param {'aesthetic'|'brand'} [kind] */
export function mappedToPreviewVars(mapped, kind = 'aesthetic') {
  const m = mapped;
  const visualStyle = m.visualStyle ?? [];
  const dark = isDark(m.colors.surface.canvas);
  return normalizePreviewVars({
    slug: m.slug,
    kind,
    visualStyle,
    primary: m.colors.brand.primary,
    primaryHover: m.colors.brand.hover,
    background: m.colors.surface.canvas,
    surface: m.colors.surface.paper,
    text: m.colors.text.primary,
    textMuted: m.colors.text.muted,
    success: m.colors.feedback.success,
    warning: m.colors.feedback.warning,
    danger: m.colors.feedback.danger,
    fontBody: m.typography.font_family.body,
    fontDisplay: m.typography.font_family.display,
    radius: visualStyle.includes('neobrutalism') || visualStyle.includes('brutalism') ? '0px' : '12px',
    dark,
    glass: visualStyle.some((v) => /glass|liquidglass/i.test(v))
  });
}

/** @param {ReturnType<typeof mapSkillDesign>['mapped']} m */
function buildDesignMd(m) {
  const fm = `---
# ============================================================
#  DESIGN.md — Single Source of Truth
#  Spec version : 1.0
#  Last updated : ${new Date().toISOString().slice(0, 10)}
#  Imported from: awesome-design-skills/${m.slug}
# ============================================================

meta:
  name: "${m.productName}"
  version: "0.1.0"
  theme: "${m.displayName} Aesthetic"
  density: "comfortable"

atmosphere:
  keywords: ${JSON.stringify(m.atmosphere.keywords)}
  inspiration: ${JSON.stringify(m.atmosphere.inspiration)}
  information_density: "${m.atmosphere.information_density}"
  whitespace_bias: "${m.atmosphere.whitespace_bias}"

colors:
  brand:
    primary:        "${m.colors.brand.primary}"
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
    display: "-0.02em"
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
  spacing_base_px: 4
  spacing_scale_px: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  container_max_px: 1280
  grid_columns: 12
  grid_gutter_px: 24

elevation:
  flat:   "0 0 0 1px rgba(23,23,21,0.06)"
  raised: "0 1px 2px rgba(23,23,21,0.06), 0 1px 3px rgba(23,23,21,0.10)"
  high:   "0 12px 32px -8px rgba(23,23,21,0.18)"
  modal:  "0 32px 64px -16px rgba(23,23,21,0.28)"

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
  const supplement = m.supplementNotes
    ? `\n\n## Product Intent (from PM)\n\n${m.supplementNotes}\n`
    : '';

  const body = `
# ${m.productName} — \`DESIGN.md\`

> **Hard rule for AI agents**: the YAML block above is *binding*. Never invent HEX outside \`tokens/**\`.

---

## 1. Visual Theme & Atmosphere

${m.atmosphereSummary}

Translate this when generating:

- Default to generous padding over dense grids.
- Prefer neutrals + one accent (${m.displayName} primary) over multi-color palettes.
- Strong information hierarchy through type size, not color saturation.

## 2. Color Palette & Roles

| Role | Token | When to use |
|---|---|---|
| Primary action | \`color.brand.primary\` | THE one button per view |
| Page canvas | \`color.surface.canvas\` | Body background |
| Body text | \`color.text.primary\` | Default copy |
| Muted text | \`color.text.muted\` | Helper text |

## 3. Typography Rules

- Display sizes use \`font.family.display\`.
- Body uses \`font.family.body\`.
- Code uses \`font.family.mono\`.

## 4. Component Stylings

Component anatomies live in \`tokens/components/*.json\`. Use CSS variables from Style Dictionary.

States: \`default · hover · active · focus-visible · disabled · loading\`.

## 5. Layout Principles

- 4 px base spacing unit from \`layout.spacing_scale_px\`.
- Max content width 1280 px, 12-column grid.

## 6. Depth & Elevation

| Layer | Token |
|---|---|
| Inline surface | \`elevation.flat\` |
| Cards | \`elevation.raised\` |
| Modals | \`elevation.modal\` |

## 7. Do's and Don'ts

### Do
${doList}

### Don't
${dontList}

## 8. Responsive Behavior

- Mobile-first; stack below \`md\`.
- Minimum touch target 44 × 44 px.

## 9. Agent Prompt Guide

\`\`\`text
You are generating Vue 3 components for ${m.productName}.
Read DESIGN.md and tokens/**. Use ONLY CSS variables from Style Dictionary.
Forbidden: raw HEX, stock Tailwind colors, ad-hoc multi-step local state.
\`\`\`
${supplement}`;

  return `${fm}\n${body.trimStart()}\n`;
}

/** @param {ReturnType<typeof mapSkillDesign>['mapped']} m */
function buildColorJson(m) {
  return {
    color: {
      base: {
        clay: {
          '300': { value: m.colors.brand.subtle, type: 'color' },
          '500': { value: m.colors.brand.primary, type: 'color' },
          '700': { value: m.colors.brand.hover, type: 'color' }
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
        moss: { value: m.colors.feedback.success, type: 'color' },
        amber: { value: m.colors.feedback.warning, type: 'color' },
        lake: { value: m.colors.feedback.info, type: 'color' }
      }
    }
  };
}

/** @param {ReturnType<typeof mapSkillDesign>['mapped']} m */
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
        display: { value: '-0.02em', type: 'dimension' },
        body: { value: '0', type: 'dimension' }
      }
    }
  };
}

export { buildDesignMd, buildColorJson, buildTypographyJson };
