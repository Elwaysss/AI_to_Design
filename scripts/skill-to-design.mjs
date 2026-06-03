#!/usr/bin/env node
/**
 * skill-to-design.mjs — import an aesthetic skill into dev-platform output DESIGN.md + tokens.
 *
 * Usage:
 *   node scripts/skill-to-design.mjs glassmorphism
 *   node scripts/skill-to-design.mjs glassmorphism --notes "专业、克制"
 */
import { exportDesign } from './lib/design-export.mjs';

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {{ slug: string, notes: string, productSlug: string }} */
  const config = { slug: '', notes: '', productSlug: 'demo-saas' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--notes') config.notes = argv[++i] ?? '';
    else if (arg === '--product') config.productSlug = argv[++i] ?? 'demo-saas';
    else if (!arg.startsWith('-')) config.slug = arg;
  }
  return config;
}

async function main() {
  const config = parseArgs(process.argv.slice(2));
  if (!config.slug) {
    console.error('Usage: node scripts/skill-to-design.mjs <skill-slug> [--notes "..."] [--product demo-saas]');
    process.exit(1);
  }

  console.log(`\nExporting aesthetic skill: ${config.slug}\n`);
  const { outputDir, files } = await exportDesign({
    kind: 'aesthetic',
    slug: config.slug,
    supplementNotes: config.notes,
    productSlug: config.productSlug
  });

  console.log(`\n✔ Exported to ${outputDir}`);
  for (const f of files) console.log(`  • ${f}`);
  console.log('');
}

main().catch((err) => {
  console.error(`\n✖ ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
