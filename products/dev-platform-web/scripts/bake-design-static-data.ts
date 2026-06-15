/**
 * Pre-bake catalog, preview vars, and export packs for static SPA (no dev API).
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { exportDesign, loadCatalog, previewMapped } from '../../../scripts/lib/design-export.mjs'
import {
  extractBrandPreviewMeta,
  mappedToBrandPreviewVars
} from '../../../scripts/lib/brand-preview-extract.mjs'
import { mappedToPreviewVars } from '../../../scripts/lib/skill-to-design-mapper.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLATFORM_ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(PLATFORM_ROOT, 'public/design-static')

type CatalogEntry = { slug: string; nameZh: string }

async function previewVarsFor(kind: 'aesthetic' | 'brand', entry: CatalogEntry) {
  const result = await previewMapped(kind, entry.slug, entry.nameZh)
  if (kind === 'brand' && result.brandRaw) {
    return mappedToBrandPreviewVars(
      result.mapped,
      extractBrandPreviewMeta(result.brandRaw, result.resolvedSlug ?? entry.slug),
      entry.slug,
      'brand'
    )
  }
  return mappedToPreviewVars(result.mapped, kind)
}

async function readPackFiles(outputDir: string, fileList: string[]) {
  const files: Record<string, string> = {}
  for (const rel of fileList) {
    try {
      files[rel] = await readFile(path.join(outputDir, rel), 'utf8')
    } catch {
      /* optional token files */
    }
  }
  return files
}

async function main() {
  const catalog = await loadCatalog()
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const previews: Record<string, unknown> = {}
  const exportPacks: Record<string, unknown> = {}
  const bakeDirs: string[] = []

  const entries: Array<{ kind: 'aesthetic' | 'brand'; entry: CatalogEntry }> = [
    ...catalog.aesthetic.map((entry: CatalogEntry) => ({ kind: 'aesthetic' as const, entry })),
    ...catalog.brand.map((entry: CatalogEntry) => ({ kind: 'brand' as const, entry }))
  ]

  for (const { kind, entry } of entries) {
    const key = `${kind}:${entry.slug}`
    previews[key] = await previewVarsFor(kind, entry)
    console.log(`✓ preview ${key}`)

    const bakeSlug = `_bake-${kind}-${entry.slug}`
    bakeDirs.push(path.join(PLATFORM_ROOT, 'output', bakeSlug))

    const result = await exportDesign({
      kind,
      slug: entry.slug,
      displayNameZh: entry.nameZh,
      productSlug: bakeSlug,
      skipValidate: true
    })

    exportPacks[key] = {
      outputDir: 'demo-saas',
      fileList: result.files,
      files: await readPackFiles(result.outputDir, result.files)
    }
    console.log(`✓ export ${key}`)
  }

  await writeFile(path.join(OUT_DIR, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
  await writeFile(path.join(OUT_DIR, 'previews.json'), `${JSON.stringify(previews)}\n`, 'utf8')
  await writeFile(path.join(OUT_DIR, 'export-packs.json'), `${JSON.stringify(exportPacks)}\n`, 'utf8')

  for (const dir of bakeDirs) {
    await rm(dir, { recursive: true, force: true })
  }

  console.log(`\nBaked ${entries.length} entries → public/design-static/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
