/**
 * Shared design export — writes DESIGN.md + tokens to dev-platform output dir.
 * Does NOT touch Paradigm root template (HANDOFF §6).
 */
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { readSkillMd } from './skill-source.mjs';
import { mapSkillDesign } from './skill-to-design-mapper.mjs';
import { readBrandDesign, resolveBrandSlug, listBrands } from './brand-source.mjs';
import { mapBrandDesign } from './design-from-mapper.mjs';
import { generateDashboardExampleVue } from './dashboard-codegen.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../..');
export const PLATFORM_ROOT = path.join(REPO_ROOT, 'products/dev-platform-web');
export const DEFAULT_OUTPUT = path.join(PLATFORM_ROOT, 'output/demo-saas');

/**
 * @param {string} command @param {string[]} args @param {string} cwd
 */
function runCommand(command, args, cwd) {
  const cmd = [command, ...args.map((a) => (a.includes(' ') ? `"${a}"` : a))].join(' ');
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, { cwd, stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`Command failed (${code}): ${command} ${args.join(' ')}`));
    });
    child.on('error', reject);
  });
}

/** @param {string} dir */
async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** @param {string} filePath @param {string} content */
async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content, 'utf8');
}

/** @param {string} src @param {string} dest */
async function copyTokenTree(src, dest) {
  const files = ['spacing.json', 'radius.json', 'elevation.json'];
  for (const f of files) {
    const from = path.join(src, f);
    try {
      await copyFile(from, path.join(dest, f));
    } catch {
      /* optional files */
    }
  }
}

/**
 * @typedef {{
 *   kind: 'aesthetic' | 'brand',
 *   slug: string,
 *   displayNameZh?: string,
 *   supplementNotes?: string,
 *   productSlug?: string
 * }} ExportRequest
 */

/**
 * @param {ExportRequest} req
 * @returns {Promise<{ outputDir: string, files: string[] }>}
 */
export async function exportDesign(req) {
  const productSlug = req.productSlug ?? 'demo-saas';
  const outputDir = path.join(PLATFORM_ROOT, 'output', productSlug);
  const tokensOut = path.join(outputDir, 'tokens/base');
  const pagesOut = path.join(outputDir, 'src/pages');

  let result;
  let sourceLabel;

  if (req.kind === 'aesthetic') {
    const { raw } = await readSkillMd(req.slug);
    result = mapSkillDesign(raw, req.slug, req.displayNameZh);
    sourceLabel = `awesome-design-skills/${req.slug}`;
  } else {
    const brands = await listBrands();
    const resolved = resolveBrandSlug(req.slug, brands);
    if (!resolved) throw new Error(`Unknown brand "${req.slug}"`);
    const { raw } = await readBrandDesign(resolved);
    result = mapBrandDesign(raw, resolved);
    sourceLabel = `awesome-design-md/${resolved}`;
  }

  let designMd = result.designMd;
  if (req.supplementNotes?.trim()) {
    designMd += `\n## Product Intent (from PM)\n\n${req.supplementNotes.trim()}\n`;
  }

  const dashboardVue = generateDashboardExampleVue(result.mapped);

  await writeText(path.join(outputDir, 'DESIGN.md'), designMd);
  await writeText(path.join(tokensOut, 'color.json'), `${JSON.stringify(result.colorJson, null, 2)}\n`);
  await writeText(path.join(tokensOut, 'typography.json'), `${JSON.stringify(result.typographyJson, null, 2)}\n`);

  if (result.spacingJson && result.elevationJson) {
    await writeText(path.join(tokensOut, 'spacing.json'), `${JSON.stringify(result.spacingJson, null, 2)}\n`);
    await writeText(path.join(tokensOut, 'elevation.json'), `${JSON.stringify(result.elevationJson, null, 2)}\n`);
  } else {
    await copyTokenTree(path.join(PLATFORM_ROOT, 'tokens/base'), tokensOut);
  }

  const radiusSrc = path.join(PLATFORM_ROOT, 'tokens/base/radius.json');
  try {
    await copyFile(radiusSrc, path.join(tokensOut, 'radius.json'));
  } catch {
    /* optional */
  }
  await writeText(path.join(pagesOut, 'DashboardExamplePage.vue'), dashboardVue);

  const marker = {
    kind: req.kind,
    slug: req.slug,
    displayName: result.mapped.displayName,
    primary: result.mapped.colors.brand.primary,
    source: sourceLabel,
    supplementNotes: req.supplementNotes ?? '',
    exportedAt: new Date().toISOString()
  };
  await writeText(path.join(outputDir, '.design-export.json'), `${JSON.stringify(marker, null, 2)}\n`);

  await runCommand('node', [path.join(REPO_ROOT, 'scripts/validate-design.mjs'), path.join(outputDir, 'DESIGN.md')], REPO_ROOT);

  const files = [
    'DESIGN.md',
    'tokens/base/color.json',
    'tokens/base/typography.json',
    'tokens/base/spacing.json',
    'tokens/base/elevation.json',
    'src/pages/DashboardExamplePage.vue',
    '.design-export.json'
  ];

  return { outputDir, files };
}

/** @param {'aesthetic'|'brand'} kind @param {string} slug @param {string} [displayNameZh] */
export async function previewMapped(kind, slug, displayNameZh) {
  if (kind === 'aesthetic') {
    const { raw } = await readSkillMd(slug);
    return mapSkillDesign(raw, slug, displayNameZh);
  }
  const brands = await listBrands();
  const resolved = resolveBrandSlug(slug, brands);
  if (!resolved) throw new Error(`Unknown brand "${slug}"`);
  const { raw } = await readBrandDesign(resolved);
  const result = mapBrandDesign(raw, resolved);
  return { ...result, brandRaw: raw, catalogSlug: slug, resolvedSlug: resolved };
}

/** Load style catalog for dev UI. */
export async function loadCatalog() {
  const catalogPath = path.join(REPO_ROOT, 'style-presets/catalog.json');
  return JSON.parse(await readFile(catalogPath, 'utf8'));
}
