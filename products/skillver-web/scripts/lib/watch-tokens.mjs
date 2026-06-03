/** Optional: rebuild Style Dictionary when token JSON changes (V2.1 CSS is in src/style.css). */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')

let building = false

/** @returns {import('vite').Plugin} */
export function watchTokensPlugin() {
  return {
    name: 'watch-tokens',
    configureServer(server) {
      server.watcher.add(path.join(ROOT, 'tokens'))
      server.watcher.on('change', (file) => {
        if (!file.includes(`${path.sep}tokens${path.sep}`) || !file.endsWith('.json') || building) return
        building = true
        const child = spawn('npm', ['run', 'tokens:build'], { cwd: ROOT, shell: true, stdio: 'inherit' })
        child.on('close', () => {
          building = false
        })
      })
    }
  }
}
