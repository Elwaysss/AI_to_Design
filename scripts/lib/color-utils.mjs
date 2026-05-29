/**
 * Color utilities for init-product.mjs — zero dependencies.
 */

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

/** @param {string} hex */
export function normalizeHex(hex) {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (!HEX_RE.test(withHash)) {
    throw new Error(`Invalid HEX color: "${hex}" (expected #RRGGBB)`);
  }
  return withHash.toUpperCase();
}

/** @param {string} hex */
export function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  };
}

/** @param {string} hex */
export function hexToRgbString(hex) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${r}, ${g}, ${b})`;
}

/** @param {number} r @param {number} g @param {number} b */
function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** @param {number} h @param {number} s @param {number} l */
function hslToRgb(h, s, l) {
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255)
  };
}

/** @param {{ r: number, g: number, b: number }} rgb */
function rgbToHex({ r, g, b }) {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

/**
 * @param {string} hex
 * @param {number} amount 0–1 fraction to lighten
 */
export function lighten(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return rgbToHex(hslToRgb(h, s, Math.min(100, l + amount * 100)));
}

/**
 * @param {string} hex
 * @param {number} amount 0–1 fraction to darken
 */
export function darken(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  return rgbToHex(hslToRgb(h, s, Math.max(0, l - amount * 100)));
}

/**
 * Derive brand clay shades from a primary HEX.
 * @param {string} primaryHex
 */
export function deriveBrandColors(primaryHex) {
  const primary = normalizeHex(primaryHex);
  return {
    primary,
    hover: darken(primary, 0.25),
    subtle: lighten(primary, 0.15)
  };
}

/**
 * @param {string} displayName
 * @returns {string}
 */
export function slugify(displayName) {
  return displayName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 214);
}

const NPM_NAME_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9][a-z0-9-._~]*$/;

/** @param {string} slug */
export function validateNpmName(slug) {
  if (!slug || !NPM_NAME_RE.test(slug)) {
    throw new Error(`Invalid npm package name: "${slug}"`);
  }
}
