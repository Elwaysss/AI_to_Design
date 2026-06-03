/**
 * Golden reference briefs — aesthetic signature & composition rules per brand.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRIEFS_PATH = path.resolve(__dirname, '../../style-presets/reference-briefs.json');

/** @type {Promise<{ version: string, brands: Record<string, unknown> }> | null} */
let cache = null;

export async function loadReferenceBriefs() {
  if (!cache) {
    cache = JSON.parse(await readFile(BRIEFS_PATH, 'utf8'));
  }
  return cache;
}

/** @param {string} slug */
export async function getReferenceBrief(slug) {
  const data = await loadReferenceBriefs();
  return data.brands[slug] ?? null;
}

/** @returns {Promise<string[]>} */
export async function listGoldenBrandSlugs() {
  const data = await loadReferenceBriefs();
  return Object.entries(data.brands)
    .filter(([, b]) => /** @type {{ golden?: boolean }} */ (b).golden)
    .map(([slug]) => slug);
}
