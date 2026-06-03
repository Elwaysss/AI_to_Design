#!/usr/bin/env node
/**
 * Validate golden brands pass aesthetic lint (10 rules).
 * Usage: node scripts/validate-aesthetic-golden.mjs
 */
import { readBrandDesign, resolveBrandSlug, listBrands } from './lib/brand-source.mjs';
import { mapBrandDesign } from './lib/design-from-mapper.mjs';
import { extractBrandPreviewMeta, mappedToBrandPreviewVars } from './lib/brand-preview-extract.mjs';
import { getReferenceBrief, listGoldenBrandSlugs } from './lib/reference-briefs.mjs';
import { runAestheticLint } from './lib/aesthetic-lint.mjs';

const slugs = await listGoldenBrandSlugs();
const brands = await listBrands();
/** @type {{ slug: string, ok: boolean, score: number, fails: number }[]} */
const results = [];

for (const slug of slugs) {
  const resolved = resolveBrandSlug(slug, brands) ?? slug;
  const { raw } = await readBrandDesign(resolved);
  const mapped = mapBrandDesign(raw, resolved);
  const meta = extractBrandPreviewMeta(raw, resolved);
  const preview = mappedToBrandPreviewVars(mapped.mapped, meta, slug, 'brand');
  const brief = await getReferenceBrief(slug);
  const lint = runAestheticLint(preview, brief);
  results.push({
    slug,
    ok: lint.ok,
    score: lint.score,
    fails: lint.findings.filter((f) => f.level === 'fail').length
  });
}

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  const mark = r.ok ? '✔' : '✘';
  console.log(`${mark} ${r.slug.padEnd(8)} score=${r.score} fails=${r.fails}`);
}

if (failed.length) {
  console.error(`\n✘ ${failed.length} golden brand(s) failed aesthetic lint.`);
  process.exit(1);
}

console.log(`\n✔ All ${results.length} golden brands passed aesthetic lint.\n`);
