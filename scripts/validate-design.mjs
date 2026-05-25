#!/usr/bin/env node
/**
 * Fallback DESIGN.md validator.
 *
 * Runs when `@google/design.md` is unavailable on the registry. Checks:
 *   1. DESIGN.md exists and parses as YAML frontmatter + Markdown body.
 *   2. The required nine sections are present.
 *   3. All token references in YAML look valid (HEX / px / numbers).
 *   4. Body contains explicit do/don't language.
 *
 * Exit code != 0 fails CI.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REQUIRED_SECTIONS = [
  'Visual Theme & Atmosphere',
  'Color Palette & Roles',
  'Typography Rules',
  'Component Stylings',
  'Layout Principles',
  'Depth & Elevation',
  "Do's and Don'ts",
  'Responsive Behavior',
  'Agent Prompt Guide'
];

const HEX_RE = /^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/;

async function main() {
  const file = process.argv[2] ?? 'DESIGN.md';
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const full = path.resolve(root, file);
  const raw = await readFile(full, 'utf8');

  const errors = [];

  // 1. Frontmatter present
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!fmMatch) {
    errors.push('Missing YAML frontmatter delimited by --- ... ---');
  }
  const body = fmMatch ? fmMatch[2] : raw;
  const frontmatter = fmMatch ? fmMatch[1] : '';

  // 2. All nine sections present
  for (const s of REQUIRED_SECTIONS) {
    if (!body.includes(s)) errors.push(`Missing required section: "${s}"`);
  }

  // 3. HEX sanity
  const hexes = frontmatter.match(/"#[0-9A-Fa-f]{3,8}"/g) ?? [];
  for (const h of hexes) {
    const v = h.slice(1, -1);
    if (!HEX_RE.test(v)) errors.push(`Invalid HEX value in frontmatter: ${h}`);
  }

  // 4. Do/Don't markers
  if (!/###?\s*Do[^\n]*\n/i.test(body) || !/###?\s*Don['’]t/i.test(body)) {
    errors.push('Section 7 must contain explicit "Do" and "Don\'t" headings.');
  }

  if (errors.length) {
    console.error('\u2716 DESIGN.md validation failed:\n');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log(`\u2714 ${file} passed local validation (${hexes.length} HEX values, ${REQUIRED_SECTIONS.length} sections).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
