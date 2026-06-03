/**
 * Resolve awesome-design-skills SKILL.md sources — local clone first.
 */
import { readFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '../..');
export const SKILLS_ROOT = path.join(ROOT, 'awesome-design-skills-main');
export const SKILLS_ALT_ROOT = path.join(ROOT, 'awesome-design-skills-main', 'awesome-design-skills-main');

/** @param {string} filePath */
async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** @returns {Promise<string>} */
async function resolveSkillsBase() {
  if (await exists(path.join(SKILLS_ROOT, 'skills'))) return SKILLS_ROOT;
  if (await exists(path.join(SKILLS_ALT_ROOT, 'skills'))) return SKILLS_ALT_ROOT;
  throw new Error(
    'awesome-design-skills clone not found. Expected awesome-design-skills-main/skills/'
  );
}

/**
 * @param {string} slug
 * @returns {Promise<string>}
 */
export async function skillMdPath(slug) {
  const base = await resolveSkillsBase();
  const normalized = slug.trim().toLowerCase();
  const direct = path.join(base, 'skills', normalized, 'SKILL.md');
  if (await exists(direct)) return direct;

  const nested = path.join(base, 'skills', `${normalized}.md`, 'SKILL.md');
  if (await exists(nested)) return nested;

  throw new Error(`Unknown skill "${slug}". Check style-presets/catalog.json aesthetic slugs.`);
}

/**
 * @param {string} slug
 * @returns {Promise<{ raw: string, path: string }>}
 */
export async function readSkillMd(slug) {
  const filePath = await skillMdPath(slug);
  const raw = await readFile(filePath, 'utf8');
  return { raw, path: filePath };
}
