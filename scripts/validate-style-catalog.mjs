#!/usr/bin/env node
/**
 * Validate style-presets/catalog.json against local skill + brand sources.
 * Exit 1 if any catalog entry cannot be resolved.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSkillMd } from './lib/skill-source.mjs';
import { listBrands, resolveBrandSlug, readBrandDesign } from './lib/brand-source.mjs';
import { mapBrandDesign } from './lib/design-from-mapper.mjs';
import { mapSkillDesign } from './lib/skill-to-design-mapper.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function main() {
  const catalogPath = path.join(ROOT, 'style-presets/catalog.json');
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  const brands = await listBrands();
  const errors = [];

  for (const a of catalog.aesthetic) {
    try {
      const { raw } = await readSkillMd(a.slug);
      mapSkillDesign(raw, a.slug, a.nameZh);
    } catch (e) {
      errors.push(`aesthetic/${a.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  for (const b of catalog.brand) {
    try {
      const resolved = resolveBrandSlug(b.slug, brands);
      if (!resolved) throw new Error('no matching brand slug');
      const { raw } = await readBrandDesign(b.slug);
      mapBrandDesign(raw, resolved);
    } catch (e) {
      errors.push(`brand/${b.slug}: ${e instanceof Error ? e.message : e}`);
    }
  }

  if (errors.length) {
    console.error(`\n✖ style catalog validation failed (${errors.length}):\n`);
    for (const err of errors) console.error(`  • ${err}`);
    process.exit(1);
  }

  console.log(
    `\n✔ style catalog OK — ${catalog.aesthetic.length} aesthetic, ${catalog.brand.length} brand entries.\n`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
