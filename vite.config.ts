import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    // Force IPv4 bind. Vite 8's default host behavior on Windows + workspace
    // paths with spaces ("AI Design Paradigm") can otherwise leave the port
    // unbound while still printing "ready". Pinning to 127.0.0.1 also keeps
    // Playwright's baseURL (http://127.0.0.1:5173) and this server in sync.
    host: '127.0.0.1',
    port: 5173,
    // Fail loudly if the port is taken (e.g. zombie node process from a prior
    // run) instead of silently drifting to 5174.
    strictPort: true
  }
})
