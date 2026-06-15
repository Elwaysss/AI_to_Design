import type { PreviewVars, StyleCatalog } from '../types/style-preset'

export type ExportPack = {
  outputDir: string
  fileList: string[]
  files: Record<string, string>
}

export type ExportPacksMap = Record<string, ExportPack>

function staticUrl(file: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  return `${base}design-static/${file}`
}

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(staticUrl(file))
  if (!res.ok) throw new Error(`Failed to load ${file} (${res.status})`)
  return res.json() as Promise<T>
}

let catalogPromise: Promise<StyleCatalog> | null = null
let previewsPromise: Promise<Record<string, PreviewVars>> | null = null
let exportPacksPromise: Promise<ExportPacksMap> | null = null

export function usesBakedData(): boolean {
  return import.meta.env.PROD
}

export async function loadDesignCatalog(): Promise<StyleCatalog> {
  if (!usesBakedData()) {
    const res = await fetch('/api/design/catalog')
    if (!res.ok) throw new Error('Failed to load catalog')
    return res.json() as Promise<StyleCatalog>
  }
  catalogPromise ??= fetchJson<StyleCatalog>('catalog.json')
  return catalogPromise
}

export async function loadPreviewVars(
  kind: 'aesthetic' | 'brand',
  slug: string
): Promise<PreviewVars> {
  if (!usesBakedData()) {
    const res = await fetch('/api/design/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, slug })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? `Preview failed (${res.status})`)
    }
    const data = (await res.json()) as { preview: PreviewVars }
    return data.preview
  }
  previewsPromise ??= fetchJson<Record<string, PreviewVars>>('previews.json')
  const previews = await previewsPromise
  const key = `${kind}:${slug}`
  const preview = previews[key]
  if (!preview) throw new Error(`Preview not found: ${key}`)
  return preview
}

export async function loadExportPack(kind: 'aesthetic' | 'brand', slug: string): Promise<ExportPack> {
  exportPacksPromise ??= fetchJson<ExportPacksMap>('export-packs.json')
  const packs = await exportPacksPromise
  const key = `${kind}:${slug}`
  const pack = packs[key]
  if (!pack) throw new Error(`Export pack not found: ${key}`)
  return pack
}
