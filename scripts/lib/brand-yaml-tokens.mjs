/**
 * Extract spacing, elevation, typography extras, and component samples
 * from awesome-design-md YAML + prose (P0 token pipeline).
 */
import { normalizeHex } from './color-utils.mjs';
import { getColorMap, getTypographyRoles, parseYaml, splitFrontmatter } from './yaml-lite.mjs';

const DEFAULT_ELEVATION_LIGHT = {
  flat: '0 0 0 1px rgba(23,23,21,0.06)',
  raised: '0 1px 2px rgba(23,23,21,0.06), 0 1px 3px rgba(23,23,21,0.10)',
  high: '0 12px 32px -8px rgba(23,23,21,0.18)',
  modal: '0 32px 64px -16px rgba(23,23,21,0.28)'
};

const DEFAULT_ELEVATION_DARK = {
  flat: '0 0 0 1px rgba(255,255,255,0.08)',
  raised: '0 8px 24px rgba(0,0,0,0.45)',
  high: '0 16px 48px rgba(0,0,0,0.55)',
  modal: '0 32px 64px rgba(0,0,0,0.65)'
};

/** @param {unknown} val */
function toPx(val) {
  if (val == null) return null;
  const s = String(val).trim();
  const n = parseFloat(s.replace(/px$/i, ''));
  return Number.isFinite(n) ? `${n}px` : null;
}

/** @param {string} ref @param {Record<string, unknown>} spacing */
function resolveSpacingRef(ref, spacing) {
  if (!ref) return null;
  const m = ref.match(/\{spacing\.(\w+)\}/);
  if (m && spacing[m[1]] != null) return toPx(spacing[m[1]]);
  return toPx(ref);
}

/** @param {string} ref @param {Record<string, unknown>} rounded */
function resolveRoundedRef(rounded, ref, fallback = '8px') {
  if (!ref) return fallback;
  const m = ref.match(/\{rounded\.(\w+)\}/);
  if (m && rounded && typeof rounded === 'object') {
    const val = /** @type {Record<string, unknown>} */ (rounded)[m[1]];
    if (val != null) {
      const s = String(val).trim();
      if (/pill|full|9999/i.test(s) || parseFloat(s) >= 120) return '9999px';
      return toPx(val) ?? fallback;
    }
  }
  if (/pill|full|9999/i.test(ref)) return '9999px';
  return toPx(ref) ?? fallback;
}

/** @param {Record<string, unknown>} components @param {string[]} keys */
function pickComponent(components, keys) {
  for (const k of keys) {
    const c = components[k];
    if (c && typeof c === 'object') return /** @type {Record<string, string>} */ (c);
  }
  return null;
}

/** @param {string} colorRef @param {Record<string, string>} colors */
function resolveColorRef(colorRef, colors) {
  if (!colorRef) return '';
  const m = colorRef.match(/\{colors\.([\w-]+)\}/);
  if (m && colors[m[1]]?.startsWith('#')) return normalizeHex(colors[m[1]]);
  if (colorRef.startsWith('#')) return normalizeHex(colorRef);
  return '';
}

/** @param {Record<string, unknown>} spacingYaml */
export function extractBrandSpacing(spacingYaml) {
  const spacing = spacingYaml && typeof spacingYaml === 'object' ? spacingYaml : {};
  /** @type {Record<string, string>} */
  const semantic = {};
  for (const [k, v] of Object.entries(spacing)) {
    const px = toPx(v);
    if (px) semantic[k] = px;
  }

  const gridGap = semantic.sm ?? semantic.md ?? '16px';
  const wrapPadding = semantic.xl ?? semantic.lg ?? '24px';
  const sectionGap =
    semantic.section ?? semantic['section-lg'] ?? semantic.xxxl ?? semantic.xxl ?? '64px';

  const values = Object.values(semantic)
    .map((v) => parseInt(v, 10))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  const uniq = [...new Set(values)];

  /** Paradigm-compatible numeric scale */
  const PARADIGM_MAP = [
    [0, '0'],
    [4, '1'],
    [8, '2'],
    [12, '3'],
    [16, '4'],
    [24, '6'],
    [32, '8'],
    [48, '12'],
    [64, '16'],
    [96, '24'],
    [128, '32']
  ];
  /** @type {Record<string, { value: string, type: string }>} */
  const spacingJson = {};
  for (const [px, key] of PARADIGM_MAP) {
    spacingJson[key] = { value: `${px}px`, type: 'dimension' };
  }
  for (const [name, px] of Object.entries(semantic)) {
    if (!['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl', 'section', 'section-sm', 'section-lg', 'hero', 'huge'].includes(name)) {
      continue;
    }
    spacingJson[name] = { value: px, type: 'dimension' };
  }

  const spacingScalePx = uniq.length ? uniq : [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

  return {
    semantic,
    gridGap,
    wrapPadding,
    sectionGap,
    spacingJson: { spacing: spacingJson },
    spacingScalePx,
    spacingBasePx: spacingScalePx.find((n) => n === 4) ?? 4
  };
}

/** @param {string} body @param {Record<string, unknown>} components @param {boolean} dark */
export function extractBrandElevation(body, components, dark = false) {
  const defaults = dark ? DEFAULT_ELEVATION_DARK : DEFAULT_ELEVATION_LIGHT;
  /** @type {string[]} */
  const shadows = [];

  for (const comp of Object.values(components)) {
    if (comp && typeof comp === 'object' && /** @type {Record<string,string>} */ (comp).shadow) {
      shadows.push(String(/** @type {Record<string,string>} */ (comp).shadow));
    }
  }

  const proseShadow =
    body.match(/shadow:\s*"([^"]+)"/i)?.[1]?.trim() ??
    body.match(/drop shadow[^`]*`([^`]+)`/i)?.[1]?.trim() ??
    '';

  const raised = shadows[0] ?? proseShadow ?? defaults.raised;
  const high = shadows[1] ?? (dark ? '0 16px 48px rgba(0,0,0,0.55)' : defaults.high);

  const elevation = {
    flat: defaults.flat,
    raised,
    high,
    modal: dark ? DEFAULT_ELEVATION_DARK.modal : defaults.modal,
    card: raised
  };

  /** @type {Record<string, { value: string, type: string }>} */
  const elevationJson = {};
  for (const [k, v] of Object.entries(elevation)) {
    if (k === 'card') continue;
    elevationJson[k] = { value: v, type: 'boxShadow' };
  }

  return { ...elevation, elevationJson: { elevation: elevationJson } };
}

/**
 * @param {Record<string, Record<string, string>>} typoRoles
 */
export function extractTypoExtras(typoRoles) {
  const body = typoRoles['body-md'] ?? typoRoles.body ?? typoRoles['body-md-medium'] ?? {};
  const caption = typoRoles.caption ?? typoRoles.micro ?? typoRoles['caption-bold'] ?? {};
  const tabular = typoRoles['body-tabular'] ?? typoRoles['body-tabular-md'] ?? body;
  const mono = typoRoles.mono ?? typoRoles.code ?? typoRoles['code-block'] ?? {};

  const monoFamily = mono.fontFamily ?? 'JetBrains Mono, ui-monospace, monospace';
  const fontFeatureTabular = tabular.fontFeature?.includes('tnum') || /tnum|tabular/.test(String(tabular.fontFeature ?? ''))
    ? '"tnum"'
    : /tnum|tabular-figure/.test(JSON.stringify(typoRoles))
      ? '"tnum"'
      : '';
  const fontFeatureStylistic = body.fontFeature?.includes('ss01') ? '"ss01"' : '';

  return {
    fontMono: monoFamily.includes("'") ? monoFamily : `'${monoFamily.split(',')[0].trim()}', ui-monospace, monospace`,
    fontSizeBody: toPx(body.fontSize) ?? '16px',
    fontSizeCaption: toPx(caption.fontSize) ?? '13px',
    fontFeatureTabular,
    fontFeatureStylistic,
    bodyWeight: body.fontWeight ?? '400'
  };
}

/**
 * @param {Record<string, unknown>} components
 * @param {Record<string, string>} colors
 * @param {Record<string, unknown>} rounded
 * @param {Record<string, unknown>} spacing
 */
export function extractComponentSamples(components, colors, rounded, spacing) {
  const inputComp = pickComponent(components, ['text-input', 'text-input-focused', 'search-pill', 'search-bar']);
  const navComp = pickComponent(components, ['nav-bar-on-mesh', 'nav-bar-on-dark', 'nav-bar-light', 'footer-light']);
  const badgeComp = pickComponent(components, [
    'badge-purple',
    'badge-tag-purple',
    'pill-tag-soft',
    'badge-popular',
    'badge-pink',
    'pill-cap-shade'
  ]);
  const secondaryComp = pickComponent(components, [
    'button-secondary-pill',
    'button-secondary',
    'button-secondary-on-dark',
    'button-ghost'
  ]);

  const inputRadius = resolveRoundedRef(rounded, inputComp?.rounded ?? '', '8px');
  const inputPad = inputComp?.padding ?? '8px 12px';
  const inputHeight = inputComp?.height ? toPx(inputComp.height) : '44px';
  const inputBorder = inputComp?.border ?? (colors.hairline ? `1px solid ${normalizeHex(colors.hairline)}` : '1px solid rgba(0,0,0,0.12)');
  const inputBg = resolveColorRef(inputComp?.backgroundColor ?? '{colors.canvas}', colors) || colors.canvas || '#fff';

  const navPad = navComp?.padding ?? resolveSpacingRef('{spacing.md}', spacing) ?? '16px 24px';
  const navRadius = resolveRoundedRef(rounded, navComp?.rounded ?? '', '8px');
  const navBg = resolveColorRef(navComp?.backgroundColor ?? '{colors.canvas}', colors) || '#fff';
  const navBorder = navComp?.border ?? (colors.hairline ? `1px solid ${normalizeHex(colors.hairline)}` : '');

  const badgePad = badgeComp?.padding ?? '4px 10px';
  const badgeRadius = resolveRoundedRef(rounded, badgeComp?.rounded ?? '{rounded.full}', '9999px');
  const badgeBg = resolveColorRef(badgeComp?.backgroundColor ?? '{colors.primary}', colors) || colors.primary || '#5645D4';
  const badgeColor = resolveColorRef(badgeComp?.textColor ?? '{colors.on-primary}', colors) || '#fff';
  const badgeLabel = badgeComp ? 'New' : 'Tag';

  const secRadius = resolveRoundedRef(rounded, secondaryComp?.rounded ?? '', '8px');
  const secPad = secondaryComp?.padding ?? '10px 18px';
  const secBorder = secondaryComp?.border ?? '';
  const secBg = resolveColorRef(secondaryComp?.backgroundColor ?? 'transparent', colors) || 'transparent';
  const secColor = resolveColorRef(secondaryComp?.textColor ?? '{colors.ink}', colors) || colors.ink || '#171715';

  return {
    input: {
      background: inputBg.startsWith('#') ? inputBg : '#fff',
      border: inputBorder,
      borderRadius: inputRadius,
      padding: inputPad,
      height: inputHeight ?? '44px'
    },
    nav: {
      background: navBg.startsWith('#') ? navBg : '#fff',
      border: navBorder,
      borderRadius: navRadius,
      padding: navPad
    },
    badge: {
      background: badgeBg.startsWith('#') ? badgeBg : '#5645D4',
      color: badgeColor.startsWith('#') ? badgeColor : '#fff',
      borderRadius: badgeRadius,
      padding: badgePad,
      label: badgeLabel
    },
    secondaryButton: {
      background: secBg === 'transparent' ? 'transparent' : secBg,
      color: secColor.startsWith('#') ? secColor : '#171715',
      border: secBorder || (secBg === 'transparent' ? `1px solid ${colors.hairline ? normalizeHex(colors.hairline) : 'rgba(0,0,0,0.15)'}` : 'none'),
      borderRadius: secRadius,
      padding: secPad
    }
  };
}

/** @param {string} hex */
export function isDarkCanvas(hex) {
  if (!hex?.startsWith('#')) return false;
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

/**
 * Full P0 token bundle from raw DESIGN.md.
 * @param {string} raw
 * @param {string} slug
 */
export function extractBrandYamlTokens(raw, slug) {
  const { yaml, body } = splitFrontmatter(raw);
  if (!yaml) {
    return extractBrandYamlTokensFallback(body, slug);
  }

  const data = parseYaml(yaml);
  const colors = getColorMap(data);
  const typoRoles = getTypographyRoles(data);
  const spacingYaml = /** @type {Record<string, unknown>} */ (data.spacing ?? {});
  const rounded = /** @type {Record<string, unknown>} */ (data.rounded ?? {});
  const components = /** @type {Record<string, unknown>} */ (data.components ?? {});

  const canvas = colors.canvas ?? colors['surface-1'] ?? '#FAFAF7';
  const dark = isDarkCanvas(canvas);

  const spacing = extractBrandSpacing(spacingYaml);
  const elevation = extractBrandElevation(body, components, dark);
  const typoExtras = extractTypoExtras(typoRoles);
  const componentSamples = extractComponentSamples(components, colors, rounded, spacingYaml);

  return {
    spacing,
    elevation,
    typoExtras,
    componentSamples,
    layout: {
      spacing_base_px: spacing.spacingBasePx,
      spacing_scale_px: spacing.spacingScalePx,
      container_max_px: 1280,
      grid_columns: 12,
      grid_gutter_px: parseInt(spacing.gridGap, 10) || 24
    }
  };
}

/** @param {string} body @param {string} slug */
function extractBrandYamlTokensFallback(body, slug) {
  const dark = slug === 'spotify';
  const spacing = extractBrandSpacing({});
  const elevation = extractBrandElevation(body, {}, dark);
  return {
    spacing,
    elevation,
    typoExtras: extractTypoExtras({}),
    componentSamples: extractComponentSamples({}, {}, {}, {}),
    layout: {
      spacing_base_px: 4,
      spacing_scale_px: spacing.spacingScalePx,
      container_max_px: 1280,
      grid_columns: 12,
      grid_gutter_px: 24
    }
  };
}

/**
 * Preview-facing flat object merged into PreviewVars.
 * @param {ReturnType<typeof extractBrandYamlTokens>} tokens
 */
export function brandTokensToPreviewChrome(tokens) {
  const { spacing, elevation, typoExtras, componentSamples } = tokens;
  return {
    spacingGrid: spacing.gridGap,
    spacingWrap: spacing.wrapPadding,
    spacingSection: spacing.sectionGap,
    elevationFlat: elevation.flat,
    elevationRaised: elevation.raised,
    elevationHigh: elevation.high,
    elevationCard: elevation.card,
    fontMono: typoExtras.fontMono,
    fontSizeBody: typoExtras.fontSizeBody,
    fontSizeCaption: typoExtras.fontSizeCaption,
    fontFeatureTabular: typoExtras.fontFeatureTabular,
    fontFeatureStylistic: typoExtras.fontFeatureStylistic,
    sampleInput: componentSamples.input,
    sampleNav: componentSamples.nav,
    sampleBadge: componentSamples.badge,
    sampleSecondaryButton: componentSamples.secondaryButton
  };
}
