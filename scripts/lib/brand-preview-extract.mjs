/**
 * Extract rich preview chrome from awesome-design-md DESIGN.md
 * (rounded, components, card tints, hero archetype, typography cues).
 */
import { normalizeHex } from './color-utils.mjs';
import { brandTokensToPreviewChrome, extractBrandYamlTokens } from './brand-yaml-tokens.mjs';
import { getColorMap, getTypographyRoles, parseYaml, splitFrontmatter } from './yaml-lite.mjs';
import { mappedToPreviewVars } from './skill-to-design-mapper.mjs';

/** @param {string} hex */
function isDarkHex(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/** @param {unknown} rounded @param {string} ref @param {string} fallback */
function resolveRoundedRef(rounded, ref, fallback) {
  if (!ref) return fallback;
  const m = ref.match(/\{rounded\.(\w+)\}/);
  if (m && rounded && typeof rounded === 'object') {
    const val = /** @type {Record<string, unknown>} */ (rounded)[m[1]];
    if (val != null) return String(val).replace(/px$/i, '') + (String(val).includes('px') ? '' : 'px');
  }
  const px = ref.match(/(\d+(?:\.\d+)?)\s*px/);
  if (px) return `${px[1]}px`;
  if (/pill|full|9999/i.test(ref)) return '9999px';
  return fallback;
}

/** @param {Record<string, unknown>} components @param {string[]} keys */
function pickComponent(components, keys) {
  for (const k of keys) {
    const c = components[k];
    if (c && typeof c === 'object') return /** @type {Record<string, string>} */ (c);
  }
  return null;
}

/** @param {string} body */
function extractShadowsFromProse(body) {
  const m =
    body.match(/shadow:\s*"([^"]+)"/i) ??
    body.match(/drop shadow[^`]*`([^`]+)`/i) ??
    body.match(/(rgba?\([^)]+\)[^"\n]{0,80})/i);
  return m?.[1]?.trim() ?? '';
}

/** 产品 catalog slug → 套用预览时的 hero 原型（与 awesome-design-md 营销页描述可能不同） */
const CATALOG_HERO_OVERRIDES = {
  shopify: 'light-clean',
  dropbox: 'light-clean',
  intercom: 'light-clean',
  apple: 'light-clean',
  google: 'light-clean',
  meta: 'light-clean',
  airtable: 'light-clean'
};

const DARK_HERO_ARCHETYPES = new Set(['dark-dev', 'immersive-dark']);

/**
 * 将 prose 推断的 hero 与真实 canvas 亮度对齐，避免「描述写 near-black CTA、实际 canvas 偏亮」时缩略图发黑。
 * @param {string} heroArchetype
 * @param {string} catalogSlug
 * @param {string} canvasHex
 */
export function reconcileHeroArchetype(heroArchetype, catalogSlug, canvasHex) {
  const catalogOverride = CATALOG_HERO_OVERRIDES[catalogSlug];
  const darkCanvas = canvasHex?.startsWith('#') && isDarkHex(canvasHex);
  const darkHero = DARK_HERO_ARCHETYPES.has(heroArchetype);

  if (catalogOverride && !darkCanvas) return catalogOverride;
  if (darkHero && !darkCanvas) return catalogOverride ?? 'light-clean';
  if (!darkHero && darkCanvas && heroArchetype === 'light-clean') return 'dark-dev';
  return heroArchetype;
}

/** @param {string} description @param {string} body @param {Record<string, string>} colors @param {string} slug */
function inferHeroArchetype(description, body, colors, slug) {
  const desc = description.toLowerCase();
  const full = `${description}\n${body}`.toLowerCase();
  const canvas = colors.canvas ?? colors['canvas-light'] ?? colors['surface-1'] ?? '';

  if (slug === 'spotify') return 'immersive-dark';
  if (slug === 'stripe') return 'gradient-mesh';
  if (CATALOG_HERO_OVERRIDES[slug]) return CATALOG_HERO_OVERRIDES[slug];

  if (
    /near-black (?:canvas|background|surface|shell|page|theme|ui|app)|(?:canvas|background|surface|shell|pages?).{0,24}near-black|#010102|charcoal panel|dark-app canvas|deepest dark surface/.test(
      desc
    ) ||
    (canvas && isDarkHex(canvas))
  ) {
    return 'dark-dev';
  }

  if (
    (/gradient mesh|gradient-mesh|pastel cream, sherbet|opens with the gradient/.test(desc) ||
      /gradient mesh backdrop|horizontal band of pastel cream/.test(full)) &&
    !/no atmospheric gradient/.test(full)
  ) {
    return 'gradient-mesh';
  }

  if (colors['brand-navy'] || /brand-navy|deep navy hero|navy hero band/.test(desc)) {
    return 'navy-hero';
  }

  if (/aubergine|cream-lavender hero|pastel-mesh hero/.test(desc) || colors['canvas-lavender']) {
    return 'aubergine-soft';
  }

  if (
    Object.keys(colors).some((k) => k.startsWith('card-tint')) ||
    /pastel-tinted|colorful database|sticky-note dots/.test(desc)
  ) {
    return 'pastel-cards';
  }

  if (/spotify green|content-first darkness|near-black immersive/.test(desc)) {
    return 'immersive-dark';
  }

  if (/illustration-rich|multicolor|colorful feature|playful/.test(desc)) {
    return 'colorful';
  }

  return 'light-clean';
}

/** @param {string} raw @param {string} slug */
export function extractBrandPreviewMeta(raw, slug) {
  const { yaml, body } = splitFrontmatter(raw);
  if (!yaml) return extractBrandPreviewMetaProse(raw, slug);

  const data = parseYaml(yaml);
  const colors = getColorMap(data);
  const typoRoles = getTypographyRoles(data);
  const description = String(data.description ?? '');
  const rounded = /** @type {Record<string, unknown>} */ (data.rounded ?? {});
  const components = /** @type {Record<string, unknown>} */ (data.components ?? {});

  const buttonComp = pickComponent(components, [
    'button-primary-pill',
    'button-primary',
    'button-on-dark',
    'button-md'
  ]);
  const cardComp = pickComponent(components, [
    'card-feature-yellow-bold',
    'card-feature-mint',
    'card-feature-sky',
    'card-feature-lavender',
    'card-feature-peach',
    'card-feature-light',
    'card-feature',
    'card-base',
    'feature-card',
    'pricing-card',
    'card-pricing'
  ]);

  const buttonRoundedRef = buttonComp?.rounded ?? '';
  const buttonRadius = resolveRoundedRef(rounded, buttonRoundedRef, '8px');
  const cardRadius = resolveRoundedRef(rounded, cardComp?.rounded ?? '{rounded.lg}', '12px');
  const buttonPill = /pill|9999|full/i.test(buttonRoundedRef) || parseInt(buttonRadius, 10) >= 120;
  const buttonPadding = buttonComp?.padding ?? '10px 18px';

  const cardTints = Object.entries(colors)
    .filter(([k, v]) => /card-tint|canvas-cream|canvas-lavender/i.test(k) && typeof v === 'string' && v.startsWith('#'))
    .map(([, v]) => normalizeHex(v))
    .slice(0, 4);

  if (!cardTints.length && colors['canvas-cream']) cardTints.push(normalizeHex(colors['canvas-cream']));
  if (!cardTints.length && colors['canvas-lavender']) cardTints.push(normalizeHex(colors['canvas-lavender']));

  const displayRole =
    typoRoles['display-lg'] ?? typoRoles['hero-display'] ?? typoRoles['display-xl'] ?? typoRoles['display-xxl'] ?? {};
  const displayWeight = displayRole.fontWeight ?? '600';
  const displayLetterSpacing = displayRole.letterSpacing ?? '-0.02em';

  const bodyText = `${description} ${body}`;
  const buttonUppercase = /uppercase|text-transform:\s*uppercase|letter-spacing:\s*1\.?4px/i.test(bodyText);
  const buttonLetterSpacing = buttonUppercase ? '0.08em' : '0';

  const cardBorder = cardComp?.border ?? (colors.hairline ? `1px solid ${normalizeHex(colors.hairline)}` : '');
  const cardShadow = extractShadowsFromProse(body) || '0 1px 2px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.06)';

  const heroArchetype = inferHeroArchetype(description, body, colors, slug);
  const heroAccent = colors['brand-navy'] ?? colors['brand-dark-900'] ?? colors.primary ?? '';

  const secondaryComp = pickComponent(components, ['button-secondary', 'button-secondary-on-dark', 'button-ghost']);
  const secondaryCtaStyle = secondaryComp?.border?.includes('solid') ? 'outline' : secondaryComp ? 'ghost' : 'outline';

  const yamlTokens = extractBrandYamlTokens(raw, slug);
  const p0 = brandTokensToPreviewChrome(yamlTokens);

  return {
    heroArchetype,
    buttonRadius,
    cardRadius,
    buttonPill,
    buttonPadding,
    buttonUppercase,
    buttonLetterSpacing,
    cardBorder,
    cardShadow: p0.elevationCard ?? cardShadow,
    cardTints,
    displayFontWeight: String(displayWeight),
    displayLetterSpacing,
    secondaryCtaStyle,
    heroAccent: heroAccent.startsWith('#') ? normalizeHex(heroAccent) : heroAccent,
    catalogSlug: slug,
    ...p0
  };
}

/** @param {string} raw @param {string} slug */
function extractBrandPreviewMetaProse(raw, slug) {
  const { byLabel, uniq } = extractProseHexColors(raw);
  const body = raw;
  const description = body.split('\n\n')[1] ?? '';
  const colors = {
    primary: byLabel.primary ?? uniq[0] ?? '#1ED760',
    canvas: byLabel.canvas ?? uniq.find(isDarkHex) ?? '#121212',
    'canvas-lavender': byLabel.lavender
  };

  const heroArchetype = slug === 'spotify' ? 'immersive-dark' : inferHeroArchetype(description, body, colors, slug);

  const yamlTokens = extractBrandYamlTokens(raw, slug);
  const p0 = brandTokensToPreviewChrome(yamlTokens);

  return {
    heroArchetype,
    buttonRadius: slug === 'spotify' ? '9999px' : '8px',
    cardRadius: slug === 'spotify' ? '8px' : '12px',
    buttonPill: /pill|500px|radius \(50%\)/i.test(body) || slug === 'spotify',
    buttonPadding: slug === 'spotify' ? '12px 24px' : '10px 18px',
    buttonUppercase: /uppercase/i.test(body),
    buttonLetterSpacing: slug === 'spotify' ? '0.12em' : '0',
    cardBorder: '',
    cardShadow: p0.elevationCard ?? extractShadowsFromProse(body) ?? '0 8px 24px rgba(0,0,0,.5)',
    cardTints: [],
    displayFontWeight: '700',
    displayLetterSpacing: '-0.02em',
    secondaryCtaStyle: 'outline',
    heroAccent: colors.canvas,
    catalogSlug: slug,
    ...p0
  };
}

/** @param {string} body */
function extractProseHexColors(body) {
  /** @type {Record<string, string>} */
  const byLabel = {};
  for (const m of body.matchAll(/\*\*([^*]+)\*\*[^(]*\(`?(#[0-9A-Fa-f]{6})`?\)/gi)) {
    const label = m[1].toLowerCase();
    const hex = normalizeHex(m[2]);
    if (/green|primary|brand accent|cta|spotify green/.test(label)) byLabel.primary = hex;
    if (/near black|deepest|canvas|background/.test(label)) byLabel.canvas = hex;
    if (/lavender/.test(label)) byLabel.lavender = hex;
  }
  const uniq = [...new Set([...body.matchAll(/`(#([0-9A-Fa-f]{6}))`/g)].map((m) => normalizeHex(m[1])))];
  return { byLabel, uniq };
}

/**
 * Merge mapped brand tokens + extracted chrome for browser preview.
 * @param {ReturnType<import('./design-from-mapper.mjs').mapBrandDesign>['mapped']} mapped
 * @param {ReturnType<typeof extractBrandPreviewMeta>} meta
 * @param {string} catalogSlug
 * @param {'aesthetic'|'brand'} kind
 */
export function mappedToBrandPreviewVars(mapped, meta, catalogSlug, kind = 'brand') {
  const base = mappedToPreviewVars(mapped, kind);
  const heroArchetype = reconcileHeroArchetype(
    meta.heroArchetype,
    catalogSlug,
    mapped.colors.surface.canvas
  );
  return {
    ...base,
    slug: catalogSlug,
    resolvedSlug: mapped.slug,
    ...meta,
    heroArchetype,
    radius: meta.buttonRadius ?? base.radius
  };
}
