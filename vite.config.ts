import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { getDevPortFromRoot } from './scripts/lib/dev-port.mjs'
import { watchTokensPlugin } from './scripts/lib/watch-tokens.mjs'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = getDevPortFromRoot(root)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    watchTokensPlugin()
  ],
  server: {
    // Force IPv4 bind. Vite 8's default host behavior on Windows + workspace
    // paths with spaces ("AI Design Paradigm") can otherwise leave the port
    // unbound while still printing "ready". Pinning to 127.0.0.1 also keeps
    // Playwright baseURL and this server in sync.
    host: '127.0.0.1',
    port,
    // Fail loudly if the port is taken (e.g. zombie node process from a prior
    // run) instead of silently drifting to another port.
    strictPort: true
  }
})
