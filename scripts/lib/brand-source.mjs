/**
 * Resolve awesome-design-md brand sources — local clone first, GitHub fallback.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const LOCAL_CLONE = path.join(ROOT, 'awesome-design-md-main');
export const DESIGN_MD_DIR = 'design-md';

const GITHUB_API =
  'https://api.github.com/repos/voltagent/awesome-design-md/contents/design-md';
const GITHUB_RAW =
  'https://raw.githubusercontent.com/voltagent/awesome-design-md/main/design-md';

/**
 * 产品常用名 → awesome-design-md 目录 slug。
 * catalog 里给用户看的名字与仓库 slug 不一致时走这里。
 */
export const BRAND_ALIASES = {
  linear: 'linear.app',
  github: 'raycast',
  discord: 'slack',
  dropbox: 'airtable',
  asana: 'zapier',
  monday: 'miro',
  google: 'meta',
  mistral: 'mistral.ai',
  linearapp: 'linear.app'
};

/** @param {string} input @param {string[]} brands */
export function resolveBrandSlug(input, brands) {
  const q = input.trim().toLowerCase();
  const aliased = BRAND_ALIASES[q];
  if (aliased && brands.includes(aliased)) return aliased;

  if (brands.includes(q)) return q;

  const exactCi = brands.find((b) => b.toLowerCase() === q);
  if (exactCi) return exactCi;

  const prefix = brands.find((b) => b.startsWith(q) || q.startsWith(b.replace(/\.(app|ai)$/, '')));
  if (prefix) return prefix;

  const dotVariant = brands.find((b) => b.replace(/\./g, '') === q.replace(/\./g, ''));
  if (dotVariant) return dotVariant;

  return null;
}

/** @param {string} filePath */
async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** @returns {Promise<boolean>} */
export async function hasLocalClone() {
  return exists(path.join(LOCAL_CLONE, DESIGN_MD_DIR));
}

/**
 * @param {string} slug
 * @returns {string}
 */
export function localBrandPath(slug) {
  return path.join(LOCAL_CLONE, DESIGN_MD_DIR, slug, 'DESIGN.md');
}

/**
 * List brand slugs from local clone or GitHub API.
 * @returns {Promise<string[]>}
 */
export async function listBrands() {
  const localDir = path.join(LOCAL_CLONE, DESIGN_MD_DIR);
  if (await exists(localDir)) {
    const entries = await readdir(localDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));
  }

  const res = await fetch(GITHUB_API, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'ai-design-paradigm' }
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch brand list from GitHub (${res.status}). ` +
        'Clone locally for offline use:\n' +
        '  git clone --depth 1 https://github.com/voltagent/awesome-design-md.git awesome-design-md-main'
    );
  }

  /** @type {{ name: string, type: string }[]} */
  const items = await res.json();
  return items.filter((i) => i.type === 'dir').map((i) => i.name).sort();
}

/**
 * Read raw DESIGN.md for a brand slug.
 * @param {string} slug
 * @returns {Promise<{ raw: string, source: 'local' | 'github' }>}
 */
export async function readBrandDesign(slug) {
  const brands = await listBrands();
  const resolved = resolveBrandSlug(slug, brands);
  if (!resolved) {
    throw new Error(`Unknown brand "${slug}". Run: npm run design:from -- --list`);
  }

  const localPath = localBrandPath(resolved);

  if (await exists(localPath)) {
    const raw = await readFile(localPath, 'utf8');
    return { raw, source: 'local', resolvedSlug: resolved };
  }

  const url = `${GITHUB_RAW}/${encodeURIComponent(resolved)}/DESIGN.md`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ai-design-paradigm' }
  });

  if (res.status === 404) {
    const suggestions = brands
      .filter((b) => b.includes(resolved) || resolved.includes(b.split('.')[0]))
      .slice(0, 5);
    const hint = suggestions.length
      ? `\n  Did you mean: ${suggestions.join(', ')}?`
      : '\n  Run: npm run design:from -- --list';
    throw new Error(`Unknown brand "${slug}" (resolved: ${resolved}).${hint}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch DESIGN.md for "${resolved}" (${res.status}). Retry or clone locally.`);
  }

  const raw = await res.text();
  return { raw, source: 'github', resolvedSlug: resolved };
}
