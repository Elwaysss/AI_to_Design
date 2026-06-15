import JSZip from 'jszip'
import type { ExportPack } from './designStaticData'

export async function downloadExportPack(
  pack: ExportPack,
  options?: { supplementNotes?: string; filename?: string }
) {
  const zip = new JSZip()
  const notes = options?.supplementNotes?.trim()

  for (const [relPath, content] of Object.entries(pack.files)) {
    let text = content
    if (relPath === 'DESIGN.md' && notes) {
      text += `\n## Product Intent (from PM)\n\n${notes}\n`
    }
    zip.file(relPath, text)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = options?.filename ?? 'demo-saas-design-export.zip'
  link.click()
  URL.revokeObjectURL(url)
}
