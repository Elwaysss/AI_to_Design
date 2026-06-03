#!/usr/bin/env node
/**
 * vercel-init.mjs — link Vercel project and sync .env.local secrets.
 *
 * Usage:
 *   npm run vercel:init
 *   npm run vercel:init -- --yes
 *   npm run vercel:init -- --skip-env-sync --force
 *
 * Requires Vercel CLI: npm i -g vercel  (or npx vercel)
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKER = path.join(ROOT, '.vercel-init.json');
const ENV_LOCAL = path.join(ROOT, '.env.local');
const VERCEL_JSON = path.join(ROOT, 'vercel.json');

const DEFAULT_VERCEL_JSON = {
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  framework: 'vite',
  rewrites: [{ source: '/(.*)', destination: '/index.html' }]
};

/** @typedef {{ yes: boolean, force: boolean, skipEnvSync: boolean, skipLink: boolean }} Config */

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {Config} */
  const config = { yes: false, force: false, skipEnvSync: false, skipLink: false };
  for (const arg of argv) {
    switch (arg) {
      case '--yes':
      case '-y':
        config.yes = true;
        break;
      case '--force':
        config.force = true;
        break;
      case '--skip-env-sync':
        config.skipEnvSync = true;
        break;
      case '--skip-link':
        config.skipLink = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printHelp();
        process.exit(1);
    }
  }
  return config;
}

function printHelp() {
  console.log(`
vercel:init — link Vercel and sync environment variables

  npm run vercel:init
  npm run vercel:init -- --yes --force
  npm run vercel:init -- --skip-env-sync

Options:
  --yes, -y           Pass --yes to vercel link
  --force             Overwrite marker / vercel.json
  --skip-env-sync     Only link + write vercel.json
  --skip-link         Only write vercel.json + env sync
`);
}

/** @param {string} cmd @param {string[]} args */
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: true, ...opts });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

/** @returns {Promise<boolean>} */
async function hasVercelCli() {
  try {
    await run('npx', ['vercel', '--version']);
    return true;
  } catch {
    return false;
  }
}

/** Parse KEY=value lines from .env.local */
async function parseEnvLocal() {
  try {
    await access(ENV_LOCAL, fsConstants.R_OK);
  } catch {
    return [];
  }
  const text = await readFile(ENV_LOCAL, 'utf8');
  /** @type {{ key: string, value: string }[]} */
  const pairs = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key.startsWith('VITE_')) pairs.push({ key, value });
  }
  return pairs;
}

async function ensureVercelJson() {
  try {
    await access(VERCEL_JSON, fsConstants.R_OK);
    console.log('==> vercel.json already exists — skipping template write');
  } catch {
    await writeFile(VERCEL_JSON, `${JSON.stringify(DEFAULT_VERCEL_JSON, null, 2)}\n`, 'utf8');
    console.log('==> Wrote vercel.json (Vite SPA rewrites)');
  }
}

/** @param {{ key: string, value: string }[]} pairs @param {boolean} yes */
async function syncEnvToVercel(pairs, yes) {
  if (pairs.length === 0) {
    console.log('==> No VITE_* vars in .env.local — skip env sync');
    return;
  }
  for (const { key, value } of pairs) {
    console.log(`==> vercel env add ${key} (production)`);
    const args = ['vercel', 'env', 'add', key, 'production'];
    if (yes) args.push('--yes');
    const child = spawn('npx', args, {
      cwd: ROOT,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true
    });
    child.stdin?.write(`${value}\n`);
    child.stdin?.end();
    await new Promise((resolve, reject) => {
      child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`env add ${key} failed`))));
    });
  }
}

async function main() {
  const config = parseArgs(process.argv.slice(2));

  try {
    await access(MARKER, fsConstants.F_OK);
    if (!config.force) {
      console.log('==> Already initialized (.vercel-init.json). Use --force to re-run.');
      return;
    }
  } catch {
    /* not initialized */
  }

  await ensureVercelJson();

  if (!config.skipLink) {
    if (!(await hasVercelCli())) {
      console.error('==> Vercel CLI not found. Run: npm i -g vercel');
      process.exit(1);
    }
    const linkArgs = ['vercel', 'link'];
    if (config.yes) linkArgs.push('--yes');
    console.log('==> Running vercel link (follow prompts if not logged in)');
    await run('npx', linkArgs);
  }

  if (!config.skipEnvSync) {
    const pairs = await parseEnvLocal();
    if (pairs.length > 0 && !config.yes) {
      const rl = createInterface({ input, output });
      const answer = await rl.question(
        `Sync ${pairs.length} VITE_* var(s) from .env.local to Vercel production? [y/N] `
      );
      rl.close();
      if (!/^y(es)?$/i.test(answer.trim())) {
        console.log('==> Skipped env sync');
      } else {
        await syncEnvToVercel(pairs, true);
      }
    } else if (pairs.length > 0) {
      await syncEnvToVercel(pairs, config.yes);
    }
  }

  await writeFile(
    MARKER,
    `${JSON.stringify({ initializedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8'
  );
  console.log('==> vercel:init complete. Deploy with: npx vercel --prod');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
