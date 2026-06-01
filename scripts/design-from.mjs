#!/usr/bin/env node
/**
 * design-from.mjs — import a brand from awesome-design-md into DESIGN.md + tokens/base/*.
 *
 * Usage:
 *   npm run design:from -- --list
 *   npm run design:from -- notion
 *   npm run design:from -- cursor --dry-run
 *   npm run design:from -- stripe --force
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  hasLocalClone,
  listBrands,
  readBrandDesign,
  resolveBrandSlug,
  ROOT
} from './lib/brand-source.mjs';
import { mapBrandDesign, patchLoginSpecContent } from './lib/design-from-mapper.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARKER = path.join(ROOT, '.design-from.json');

/** @typedef {{ list: boolean, dryRun: boolean, force: boolean, brand: string }} CliConfig */

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {CliConfig} */
  const config = { list: false, dryRun: false, force: false, brand: '' };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--list':
        config.list = true;
        break;
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--force':
        config.force = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown flag: ${arg}`);
        if (!config.brand) config.brand = arg;
        else throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  return config;
}

function printHelp() {
  console.log(`
Usage: npm run design:from -- [brand] [options]

Options:
  --list       List available brand slugs (~73 from awesome-design-md)
  --dry-run    Preview mapped output without writing files
  --force      Overwrite even if .design-from.json exists
  -h, --help   Show this help

Examples:
  npm run design:from -- --list
  npm run design:from -- notion
  npm run design:from -- cursor --dry-run
  npm run design:from -- stripe --force

Source resolution:
  1. Local:  awesome-design-md-main/design-md/<brand>/DESIGN.md
  2. Remote: raw.githubusercontent.com/voltagent/awesome-design-md/...
`);
}

/** @param {string} filePath */
async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** @param {string} filePath @param {string} content */
async function writeText(filePath, content) {
  await writeFile(filePath, content, 'utf8');
  console.log(`  ✔ ${path.relative(ROOT, filePath)}`);
}

/** @param {string} command @param {string[]} args */
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('close', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`Command failed (${code}): ${command} ${args.join(' ')}`));
    });
    child.on('error', reject);
  });
}

async function cmdList() {
  const local = await hasLocalClone();
  console.log(`\nBrand templates (${local ? 'local clone' : 'GitHub API'}):\n`);
  const brands = await listBrands();
  const cols = 4;
  for (let i = 0; i < brands.length; i += cols) {
    console.log('  ' + brands.slice(i, i + cols).join('  '));
  }
  console.log(`\n  Total: ${brands.length} brands`);
  if (!local) {
    console.log(
      '\n  Tip: clone for offline use:\n' +
        '    git clone --depth 1 https://github.com/voltagent/awesome-design-md.git awesome-design-md-main\n'
    );
  }
}

/**
 * @param {string} slug
 * @param {boolean} dryRun
 */
async function cmdImport(slug, dryRun) {
  const brands = await listBrands();
  const resolved = resolveBrandSlug(slug, brands);
  if (!resolved) {
    throw new Error(`Unknown brand "${slug}". Run: npm run design:from -- --list`);
  }

  console.log(`\nImporting brand: ${resolved}`);
  const { raw, source } = await readBrandDesign(resolved);
  console.log(`  Source: ${source}`);

  const result = mapBrandDesign(raw, resolved);
  const { mapped, designMd, colorJson, typographyJson } = result;

  console.log(`  Primary: ${mapped.colors.brand.primary}`);
  console.log(`  Product: ${mapped.productName}`);

  if (dryRun) {
    console.log('\n--- DRY RUN (no files written) ---\n');
    console.log(designMd.slice(0, 1200) + '\n...(truncated)\n');
    return;
  }

  console.log('\nWriting files...\n');

  await writeText(path.join(ROOT, 'DESIGN.md'), designMd);
  await writeText(path.join(ROOT, 'tokens/base/color.json'), `${JSON.stringify(colorJson, null, 2)}\n`);
  await writeText(
    path.join(ROOT, 'tokens/base/typography.json'),
    `${JSON.stringify(typographyJson, null, 2)}\n`
  );

  const loginSpecPath = path.join(ROOT, 'tests/e2e/login.spec.ts');
  if (await fileExists(loginSpecPath)) {
    const spec = await readFile(loginSpecPath, 'utf8');
    await writeText(loginSpecPath, patchLoginSpecContent(spec, mapped.colors.brand.primary));
  }

  const marker = {
    brand: resolved,
    displayName: mapped.displayName,
    primary: mapped.colors.brand.primary,
    importedAt: new Date().toISOString()
  };
  await writeText(MARKER, `${JSON.stringify(marker, null, 2)}\n`);

  console.log('\nRunning validation...\n');
  await runCommand('npm', ['run', 'tokens:build']);
  await runCommand('node', ['scripts/validate-design.mjs', 'DESIGN.md']);

  console.log(`\n✔ Brand "${resolved}" imported successfully.`);
  console.log('  Run: npm run test:e2e -- --project=chromium');
  console.log('  Run: npm run dev  (verify LoginForm CTA color)\n');
}

async function main() {
  const config = parseArgs(process.argv.slice(2));

  if (config.list) {
    await cmdList();
    return;
  }

  if (!config.brand) {
    printHelp();
    process.exit(1);
  }

  if ((await fileExists(MARKER)) && !config.force) {
    console.error('\n✖ A brand was already imported (.design-from.json exists).');
    console.error('  Re-run with --force to overwrite.\n');
    process.exit(1);
  }

  await cmdImport(config.brand, config.dryRun);
}

main().catch((err) => {
  console.error(`\n✖ ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
