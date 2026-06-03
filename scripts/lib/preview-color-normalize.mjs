/**
 * Ensure preview text/surface pairs remain readable (WCAG-aware).
 */
import { contrastRatio } from './aesthetic-lint.mjs';
import { hexToRgb, normalizeHex } from './color-utils.mjs';

/** @param {string} hex */
export function isDarkHex(hex) {
  if (!hex?.startsWith('#')) return false;
  try {
    const { r, g, b } = hexToRgb(normalizeHex(hex));
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  } catch {
    return false;
  }
}

/** @param {{ r: number, g: number, b: number }} rgb */
function rgbToHex({ r, g, b }) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[c(r), c(g), c(b)].map((n) => n.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** @param {string} canvas */
function elevatedSurfaceFromCanvas(canvas) {
  try {
    const { r, g, b } = hexToRgb(normalizeHex(canvas));
    return rgbToHex({ r: r + 18, g: g + 18, b: b + 20 });
  } catch {
    return '#1E293B';
  }
}

/**
 * @param {string} preferred
 * @param {string} bg
 * @param {{ minRatio?: number, fallbackLight?: string, fallbackDark?: string }} [opts]
 */
export function ensureReadableText(preferred, bg, opts = {}) {
  const minRatio = opts.minRatio ?? 4.5;
  const fallbackLight = opts.fallbackLight ?? '#F1F5F9';
  const fallbackDark = opts.fallbackDark ?? '#171715';
  const darkBg = isDarkHex(bg);

  let candidate = preferred?.startsWith('#') ? normalizeHex(preferred) : darkBg ? fallbackLight : fallbackDark;

  if (contrastRatio(candidate, bg) >= minRatio) return candidate;

  const alt = darkBg ? fallbackLight : fallbackDark;
  if (contrastRatio(alt, bg) >= minRatio) return alt;

  return darkBg ? '#FFFFFF' : '#171715';
}

/** @param {string} primary */
export function pickCtaForeground(primary) {
  try {
    const p = normalizeHex(primary);
    const onWhite = contrastRatio('#FFFFFF', p);
    const onBlack = contrastRatio('#000000', p);
    return onWhite >= onBlack ? '#FFFFFF' : '#000000';
  } catch {
    return '#FFFFFF';
  }
}

/**
 * @param {Record<string, unknown>} vars — PreviewVars-like
 */
export function normalizePreviewVars(vars) {
  const background = String(vars.background ?? '#FAFAF7');
  const dark = vars.dark === true || isDarkHex(background);
  let surface = String(vars.surface ?? '#FFFFFF');

  if (dark && !isDarkHex(surface)) {
    surface = elevatedSurfaceFromCanvas(background);
  }
  if (!dark && isDarkHex(surface) && !isDarkHex(String(vars.text ?? ''))) {
    surface = '#FFFFFF';
  }

  const text = ensureReadableText(String(vars.text ?? ''), background);
  const textMuted = ensureReadableText(String(vars.textMuted ?? ''), background, {
    minRatio: 3,
    fallbackLight: '#94A3B8',
    fallbackDark: '#64748B'
  });
  const textOnSurface = ensureReadableText(text, surface);
  const textMutedOnSurface = ensureReadableText(textMuted, surface, {
    minRatio: 3,
    fallbackLight: '#94A3B8',
    fallbackDark: '#64748B'
  });
  const ctaText = pickCtaForeground(String(vars.primary ?? '#3B82F6'));

  return {
    ...vars,
    dark,
    background,
    surface,
    text,
    textMuted,
    textOnSurface,
    textMutedOnSurface,
    ctaText
  };
}
