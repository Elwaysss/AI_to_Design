#!/usr/bin/env node
/**
 * init-product.mjs — personalize a forked AI Design Paradigm product.
 *
 * Usage:
 *   npm run init
 *   npm run init -- --name "Reading List" --slug reading-list --color "#2563EB" --force
 *   npm run init -- --name "Reading List" --slug reading-list --color "#2563EB" --strip-demo --force
 */
import { readFile, writeFile, unlink, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deriveBrandColors,
  hexToRgbString,
  normalizeHex,
  slugify,
  validateNpmName
} from './lib/color-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKER = path.join(ROOT, '.init-complete.json');
const DEFAULT_COLOR = '#B8422E';

/** @typedef {{ name: string, slug: string, color: string, stripDemo: boolean, force: boolean, brandImported?: boolean }} InitConfig */

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {InitConfig} */
  const config = {
    name: '',
    slug: '',
    color: DEFAULT_COLOR,
    stripDemo: false,
    force: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--name':
        config.name = argv[++i] ?? '';
        break;
      case '--slug':
        config.slug = argv[++i] ?? '';
        break;
      case '--color':
        config.color = argv[++i] ?? DEFAULT_COLOR;
        break;
      case '--strip-demo':
        config.stripDemo = true;
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
        if (arg.startsWith('-')) {
          throw new Error(`Unknown flag: ${arg}`);
        }
    }
  }

  return config;
}

function printHelp() {
  console.log(`
Usage: npm run init [-- [options]]

Options:
  --name <displayName>   Product display name (required in non-interactive mode)
  --slug <npmName>       npm package name slug (default: kebab-case of name)
  --color <#RRGGBB>      Brand primary color (default: ${DEFAULT_COLOR})
  --strip-demo           Remove LoginForm demo and write blank App shell
  --force                Re-run even if .init-complete.json exists
  -h, --help             Show this help
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

/** @param {string} question @param {string} [defaultValue] */
async function ask(question, defaultValue = '') {
  const rl = createInterface({ input, output });
  try {
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || defaultValue;
  } finally {
    rl.close();
  }
}

/** @param {string} question @param {boolean} defaultYes */
async function askYesNo(question, defaultYes) {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await ask(`${question} (${hint})`, defaultYes ? 'y' : 'n')).toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

/** @param {Partial<InitConfig>} partial */
async function resolveConfig(partial) {
  const interactive = !partial.name;

  let name = partial.name ?? '';
  let slug = partial.slug ?? '';
  let color = partial.color ?? DEFAULT_COLOR;
  let stripDemo = partial.stripDemo ?? false;

  if (interactive) {
    console.log('\n AI Design Paradigm — product init\n');

    name = await ask('Product display name');
    while (!name || name.length > 60) {
      console.log('  Name is required and must be ≤ 60 characters.');
      name = await ask('Product display name');
    }

    const suggested = slugify(name);
    slug = await ask('npm package name (slug)', suggested);

    color = await ask('Brand primary color (HEX)', DEFAULT_COLOR);

    const brandSlug = await ask('Import brand template (slug from design:from --list, or skip)', 'skip');
    if (brandSlug && brandSlug.toLowerCase() !== 'skip') {
      console.log(`\n  Running design:from ${brandSlug}...\n`);
      await runCommand('node', ['scripts/design-from.mjs', brandSlug, '--force']);
      stripDemo = await askYesNo('Remove demo components (LoginForm)?', false);
      return resolveConfigAfterBrandImport({ name, slug, color, stripDemo, force: partial.force ?? false });
    }

    stripDemo = await askYesNo('Remove demo components (LoginForm)?', false);
  }

  if (!slug) slug = slugify(name);
  validateNpmName(slug);
  color = normalizeHex(color);

  return {
    name,
    slug,
    color,
    stripDemo,
    force: partial.force ?? false,
    brandImported: false
  };
}

/** @param {InitConfig & { brandImported?: boolean }} config */
async function resolveConfigAfterBrandImport(config) {
  validateNpmName(config.slug || slugify(config.name));
  return {
    ...config,
    slug: config.slug || slugify(config.name),
    color: normalizeHex(config.color || DEFAULT_COLOR),
    brandImported: true
  };
}

/** @param {string} filePath @param {string} content */
async function writeText(filePath, content) {
  await writeFile(filePath, content, 'utf8');
  console.log(`  ✔ ${path.relative(ROOT, filePath)}`);
}

/** @param {string} filePath */
async function removeFile(filePath) {
  if (await fileExists(filePath)) {
    await unlink(filePath);
    console.log(`  ✔ removed ${path.relative(ROOT, filePath)}`);
  }
}

/** @param {InitConfig} config */
async function patchPackageJson(config) {
  const filePath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(await readFile(filePath, 'utf8'));
  pkg.name = config.slug;
  pkg.description = `${config.name} — AI-driven design & engineering pipeline (Vue 3 + DESIGN.md SSOT).`;
  await writeText(filePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

/** @param {InitConfig} config */
async function patchIndexHtml(config) {
  const filePath = path.join(ROOT, 'index.html');
  let html = await readFile(filePath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${config.name}</title>`);
  await writeText(filePath, html);
}

/**
 * @param {InitConfig} config
 * @param {{ primary: string, hover: string, subtle: string }} colors
 */
async function patchDesignMd(config, colors) {
  const filePath = path.join(ROOT, 'DESIGN.md');
  let raw = await readFile(filePath, 'utf8');

  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) throw new Error('DESIGN.md: missing YAML frontmatter');

  let fm = match[1];
  let body = match[2];

  fm = fm.replace(/(name:\s*)"[^"]*"/, `$1"${config.name}"`);
  fm = fm.replace(
    /(primary:\s*)"#[0-9A-Fa-f]{6}"(\s*#[^\n]*)/,
    `$1"${colors.primary}"$2`
  );
  fm = fm.replace(/(primary-hover:\s*)"#[0-9A-Fa-f]{6}"/, `$1"${colors.hover}"`);
  fm = fm.replace(/(primary-subtle:\s*)"#[0-9A-Fa-f]{6}"/, `$1"${colors.subtle}"`);
  fm = fm.replace(/(danger:\s*)"#[0-9A-Fa-f]{6}"/, `$1"${colors.primary}"`);

  body = body.replace(/^# AI Design Paradigm — `DESIGN\.md`$/m, `# ${config.name} — \`DESIGN.md\``);
  body = body.replace(/Boston Clay/g, 'brand accent');
  body = body.replace(
    /You are generating a Vue 3 \+ Tailwind v4 component for the AI Design Paradigm Starter\./,
    `You are generating a Vue 3 + Tailwind v4 component for ${config.name}.`
  );

  await writeText(filePath, `---\n${fm}\n---\n${body}`);
}

/** @param {InitConfig} config */
async function patchDesignMdName(config) {
  const filePath = path.join(ROOT, 'DESIGN.md');
  let raw = await readFile(filePath, 'utf8');
  raw = raw.replace(/(meta:\s*\n\s*name:\s*)"[^"]*"/, `$1"${config.name}"`);
  raw = raw.replace(/^# [^-]+ — `DESIGN\.md`$/m, `# ${config.name} — \`DESIGN.md\``);
  raw = raw.replace(
    /You are generating a Vue 3 \+ Tailwind v4 component for [^.]+\./,
    `You are generating a Vue 3 + Tailwind v4 component for ${config.name}.`
  );
  await writeText(filePath, raw);
}

/**
 * @param {InitConfig} config
 * @param {{ primary: string, hover: string, subtle: string }} colors
 */
async function patchColorTokens(config, colors) {
  const filePath = path.join(ROOT, 'tokens/base/color.json');
  const data = JSON.parse(await readFile(filePath, 'utf8'));
  const clay = data.color.base.clay;

  clay['300'].value = colors.subtle;
  clay['300'].comment = `${config.name} — primary subtle / hover-up`;
  clay['500'].value = colors.primary;
  clay['500'].comment = `${config.name} — brand primary driver`;
  clay['700'].value = colors.hover;
  clay['700'].comment = `${config.name} — primary pressed / hover`;

  await writeText(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

/**
 * @param {string} primaryHex
 */
async function patchLoginSpec(primaryHex) {
  const filePath = path.join(ROOT, 'tests/e2e/login.spec.ts');
  if (!(await fileExists(filePath))) return;

  let spec = await readFile(filePath, 'utf8');
  const rgb = hexToRgbString(primaryHex);

  spec = spec.replace(/expect\(bg\)\.toBe\('rgb\([^']+\)'\);/, `expect(bg).toBe('${rgb}');`);
  spec = spec.replace(/\/\/ #[0-9A-Fa-f]{6}[^\n]*/, `// ${primaryHex} — clay.500 after init`);

  await writeText(filePath, spec);
}

/** @param {InitConfig} config */
async function stripDemo(config) {
  await removeFile(path.join(ROOT, 'src/components/LoginForm.vue'));
  await removeFile(path.join(ROOT, 'src/components/HelloWorld.vue'));
  await removeFile(path.join(ROOT, 'tests/e2e/login.spec.ts'));

  const appVue = `<script setup lang="ts">
const productName = ${JSON.stringify(config.name)};
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-surface-canvas px-6">
    <h1 class="font-display text-4xl font-semibold text-text-primary">{{ productName }}</h1>
  </main>
</template>
`;
  await writeText(path.join(ROOT, 'src/App.vue'), appVue);

  const smokeSpec = `import { test, expect } from '@playwright/test';

/**
 * Smoke spec — verifies init scaffold and token pipeline after --strip-demo.
 */
test.describe('app shell', () => {
  test('renders product title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: ${JSON.stringify(config.name)} })).toBeVisible();
  });

  test('page title matches product name', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(${JSON.stringify(config.name)});
  });
});
`;
  await writeText(path.join(ROOT, 'tests/e2e/smoke.spec.ts'), smokeSpec);
}

/** @param {InitConfig} config */
async function writeMarker(config) {
  const marker = {
    name: config.name,
    slug: config.slug,
    color: config.color,
    stripDemo: config.stripDemo,
    initializedAt: new Date().toISOString()
  };
  await writeText(MARKER, `${JSON.stringify(marker, null, 2)}\n`);
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

/** @param {InitConfig} config */
async function runPostInitValidation() {
  console.log('\nRunning post-init validation...\n');
  await runCommand('npm', ['run', 'tokens:build']);
  await runCommand('node', ['scripts/validate-design.mjs', 'DESIGN.md']);
  await runCommand('npm', ['run', 'test:e2e', '--', '--project=chromium']);
}

async function main() {
  const partial = parseArgs(process.argv.slice(2));

  if (await fileExists(MARKER) && !partial.force) {
    console.error('\n✖ This product was already initialized (.init-complete.json exists).');
    console.error('  Re-run with --force to overwrite.\n');
    process.exit(1);
  }

  const config = await resolveConfig(partial);
  const colors = deriveBrandColors(config.color);

  console.log('\nApplying changes...\n');

  await patchPackageJson(config);
  await patchIndexHtml(config);

  if (!config.brandImported) {
    await patchDesignMd(config, colors);
    await patchColorTokens(config, colors);
  } else {
    await patchDesignMdName(config);
  }

  if (config.stripDemo) {
    await stripDemo(config);
  } else if (!config.brandImported) {
    await patchLoginSpec(colors.primary);
  }

  try {
    await runPostInitValidation();
  } catch (err) {
    console.error('\n✖ Post-init validation failed. .init-complete.json was NOT written.');
    console.error(`  ${err instanceof Error ? err.message : err}\n`);
    process.exit(1);
  }

  await writeMarker(config);

  console.log(`\n✔ Product "${config.name}" initialized successfully.`);
  console.log('  Next: git add -A && git commit -m "chore: init product scaffold"\n');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
