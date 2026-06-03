import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { getDevPortFromRoot } from './scripts/lib/dev-port.mjs'
import { watchTokensPlugin } from './scripts/lib/watch-tokens.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = getDevPortFromRoot(root)

export default defineConfig({
  plugins: [vue(), tailwindcss(), watchTokensPlugin()],
  server: {
    host: '127.0.0.1',
    port,
    strictPort: true
  }
})
