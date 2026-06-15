/**
 * Bake style/brand sample pages as standalone HTML for GitHub Pages (no dev API).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCatalog, previewMapped } from '../../../scripts/lib/design-export.mjs'
import {
  extractBrandPreviewMeta,
  mappedToBrandPreviewVars
} from '../../../scripts/lib/brand-preview-extract.mjs'
import { mappedToPreviewVars } from '../../../scripts/lib/skill-to-design-mapper.mjs'
import { buildSampleHtml } from '../src/lib/previewTokens'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLATFORM_ROOT = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(PLATFORM_ROOT, '../..')
const OUT_DIR = path.join(REPO_ROOT, 'docs/dev-platform-previews')

type CatalogEntry = {
  slug: string
  nameZh: string
  summaryZh?: string
}

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

function buildIndexHtml(items: Array<{
  kind: 'aesthetic' | 'brand'
  slug: string
  nameZh: string
  summaryZh: string
  href: string
}>) {
  const aesthetic = items.filter((i) => i.kind === 'aesthetic')
  const brand = items.filter((i) => i.kind === 'brand')
  const card = (i: (typeof items)[number]) => `
    <a class="card" href="${i.href}" data-kind="${i.kind}">
      <span class="kind">${i.kind === 'aesthetic' ? '美学' : '品牌'}</span>
      <strong>${i.nameZh}</strong>
      <p>${i.summaryZh}</p>
    </a>`

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dev Platform — 风格样例静态库</title>
  <style>
    :root {
      --bg: #0f1117;
      --surface: #1a1d27;
      --text: #f4f4f5;
      --muted: #a1a1aa;
      --primary: #6366f1;
      --border: rgba(255,255,255,.08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    .wrap { max-width: 1120px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
    h1 { margin: 0 0 .5rem; font-size: 1.75rem; letter-spacing: -.02em; }
    .lead { color: var(--muted); margin: 0 0 1.5rem; max-width: 52ch; }
    .tabs { display: flex; gap: .5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .tab {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      padding: .45rem .85rem;
      border-radius: 999px;
      cursor: pointer;
      font-size: .875rem;
    }
    .tab[aria-selected="true"] { background: var(--primary); border-color: transparent; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: .85rem;
    }
    .card {
      display: block;
      text-decoration: none;
      color: inherit;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      transition: border-color .15s, transform .15s;
    }
    .card:hover { border-color: rgba(99,102,241,.45); transform: translateY(-1px); }
    .card .kind {
      display: inline-block;
      font-size: .7rem;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--muted);
      margin-bottom: .35rem;
    }
    .card strong { display: block; font-size: 1rem; margin-bottom: .25rem; }
    .card p { margin: 0; font-size: .82rem; color: var(--muted); }
    .section { margin-top: 2rem; }
    .section h2 { font-size: 1rem; margin: 0 0 .75rem; color: var(--muted); font-weight: 600; }
    .meta { margin-top: 2rem; font-size: .8rem; color: var(--muted); }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>交互与界面设计 — 静态样例库</h1>
    <p class="lead">由 dev-platform-web 导出的独立 HTML，无需本地 dev server。共 ${items.length} 个样例（美学 ${aesthetic.length} + 品牌 ${brand.length}）。</p>
    <div class="tabs" role="tablist">
      <button class="tab" type="button" data-filter="all" aria-selected="true">全部</button>
      <button class="tab" type="button" data-filter="aesthetic" aria-selected="false">美学 (${aesthetic.length})</button>
      <button class="tab" type="button" data-filter="brand" aria-selected="false">品牌 (${brand.length})</button>
    </div>
    <div class="grid" id="grid">
      ${items.map(card).join('\n')}
    </div>
    <p class="meta">导出时间：<time id="exported-at"></time> · 源仓库 Elwaysss/AI_to_Design</p>
  </div>
  <script>
    const exportedAt = ${JSON.stringify(new Date().toISOString())};
    document.getElementById('exported-at').textContent = new Date(exportedAt).toLocaleString('zh-CN');
    const grid = document.getElementById('grid');
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => t.setAttribute('aria-selected', t === tab ? 'true' : 'false'));
        grid.querySelectorAll('.card').forEach((card) => {
          const show = filter === 'all' || card.dataset.kind === filter;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  </script>
</body>
</html>`
}

async function main() {
  const catalog = await loadCatalog()
  await mkdir(OUT_DIR, { recursive: true })

  const entries: Array<{ kind: 'aesthetic' | 'brand'; entry: CatalogEntry }> = [
    ...catalog.aesthetic.map((entry: CatalogEntry) => ({ kind: 'aesthetic' as const, entry })),
    ...catalog.brand.map((entry: CatalogEntry) => ({ kind: 'brand' as const, entry }))
  ]

  const manifest: Array<{
    kind: string
    slug: string
    nameZh: string
    file: string
    exportedAt: string
  }> = []

  for (const { kind, entry } of entries) {
    const vars = await previewVarsFor(kind, entry)
    const html = buildSampleHtml(vars, entry.nameZh)
    const file = `${kind}-${entry.slug}.html`
    await writeFile(path.join(OUT_DIR, file), html, 'utf8')
    manifest.push({
      kind,
      slug: entry.slug,
      nameZh: entry.nameZh,
      file,
      exportedAt: new Date().toISOString()
    })
    console.log(`✓ ${file}`)
  }

  const indexItems = entries.map(({ kind, entry }) => ({
    kind,
    slug: entry.slug,
    nameZh: entry.nameZh,
    summaryZh: entry.summaryZh ?? '',
    href: `${kind}-${entry.slug}.html`
  }))

  await writeFile(path.join(OUT_DIR, 'index.html'), buildIndexHtml(indexItems), 'utf8')
  await writeFile(
    path.join(OUT_DIR, 'manifest.json'),
    `${JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), items: manifest }, null, 2)}\n`,
    'utf8'
  )
  await writeFile(path.join(OUT_DIR, '.nojekyll'), '', 'utf8')

  const pagesUrl = 'https://elwaysss.github.io/AI_to_Design/'
  console.log(`\nExported ${manifest.length} previews + index → docs/dev-platform-previews/`)
  console.log(`Permanent URL (push main + enable GitHub Pages → Actions): ${pagesUrl}`)
  console.log(`Or open locally: docs/dev-platform-previews/index.html`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
