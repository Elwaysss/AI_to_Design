/**
 * GitHub Pages SPA fallback — serve index.html for unknown routes.
 */
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(root, '../dist')

await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
console.log('Copied dist/index.html → dist/404.html')
