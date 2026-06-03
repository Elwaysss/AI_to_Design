/** Vite plugin: rebuild Style Dictionary when token JSON files change. */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

let building = false;
let queued = false;

function runTokensBuild() {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  const child = spawn('npm', ['run', 'tokens:build'], {
    cwd: ROOT,
    shell: true,
    stdio: 'inherit'
  });
  child.on('close', () => {
    building = false;
    if (queued) {
      queued = false;
      runTokensBuild();
    }
  });
}

/** @returns {import('vite').Plugin} */
export function watchTokensPlugin() {
  return {
    name: 'watch-tokens',
    configureServer(server) {
      server.watcher.add(path.join(ROOT, 'tokens'));
      server.watcher.on('change', (file) => {
        if (file.includes(`${path.sep}tokens${path.sep}`) && file.endsWith('.json')) {
          runTokensBuild();
        }
      });
    }
  };
}
