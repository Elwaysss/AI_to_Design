#!/usr/bin/env node
/**
 * supabase-init.mjs — wire Supabase Auth into the starter template.
 *
 * Usage:
 *   npm run supabase:init
 *   npm run supabase:init -- --url https://xxx.supabase.co --anon-key eyJ...
 *   npm run supabase:init -- --create --name my-app
 *
 * Requires @supabase/supabase-js (installed automatically).
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createProject,
  getProjectApiKeys,
  listOrganizations,
  projectRefFromUrl,
  runSql,
  waitForProjectReady
} from './lib/supabase-api.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKER = path.join(ROOT, '.supabase-init.json');
const ENV_FILE = path.join(ROOT, '.env.local');
const ENV_EXAMPLE = path.join(ROOT, '.env.example');
const SCHEMA_FILE = path.join(ROOT, 'supabase', 'schema.sql');

/** @typedef {{ mode: 'link' | 'create', url: string, anonKey: string, accessToken: string, projectName: string, dbPass: string, force: boolean, skipSchema: boolean }} Config */

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {Config} */
  const config = {
    mode: 'link',
    url: '',
    anonKey: '',
    accessToken: process.env.SUPABASE_ACCESS_TOKEN ?? '',
    projectName: '',
    dbPass: '',
    force: false,
    skipSchema: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--create':
        config.mode = 'create';
        break;
      case '--url':
        config.url = argv[++i] ?? '';
        break;
      case '--anon-key':
        config.anonKey = argv[++i] ?? '';
        break;
      case '--access-token':
        config.accessToken = argv[++i] ?? '';
        break;
      case '--name':
        config.projectName = argv[++i] ?? '';
        break;
      case '--db-pass':
        config.dbPass = argv[++i] ?? '';
        break;
      case '--skip-schema':
        config.skipSchema = true;
        break;
      case '--force':
        config.force = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return config;
}

function printHelp() {
  console.log(`
Usage: npm run supabase:init [-- [options]]

Link an existing Supabase project (default):
  npm run supabase:init
  npm run supabase:init -- --url https://xxx.supabase.co --anon-key eyJ...

Create a new project via Management API:
  npm run supabase:init -- --create --name my-app
  SUPABASE_ACCESS_TOKEN=sbp_... npm run supabase:init -- --create

Options:
  --create              Create a new Supabase project (needs access token)
  --url <url>           Project URL (Settings → API)
  --anon-key <key>      Anon public key
  --access-token <tok>  Personal access token (supabase.com/dashboard/account/tokens)
  --name <name>         New project name (with --create)
  --db-pass <pass>      Database password (with --create, min 8 chars)
  --skip-schema         Skip applying supabase/schema.sql
  --force               Overwrite .env.local / .supabase-init.json
  -h, --help            Show this help

Get credentials:
  Dashboard → Project Settings → API → Project URL + anon public key
  Access token → https://supabase.com/dashboard/account/tokens
`);
}

/** @param {string} filePath */
async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/** @param {string} question @param {string} [defaultValue] */
async function ask(question, defaultValue = '') {
  const rl = createInterface({ input, output });
  try {
    const suffix = defaultValue ? ` [${defaultValue.slice(0, 20)}${defaultValue.length > 20 ? '…' : ''}]` : '';
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    return answer || defaultValue;
  } finally {
    rl.close();
  }
}

/** @param {string} question */
async function askSecret(question) {
  return ask(question);
}

/** @param {string} filePath @param {string} content */
async function writeText(filePath, content) {
  await writeFile(filePath, content, 'utf8');
  console.log(`  ✔ ${path.relative(ROOT, filePath)}`);
}

/** @param {string} command @param {string[]} args */
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    child.on('close', (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`Command failed (${code}): ${command} ${args.join(' ')}`));
    });
    child.on('error', reject);
  });
}

/** @param {Config} partial */
async function resolveConfig(partial) {
  const config = { ...partial };

  if (config.mode === 'create') {
    if (!config.accessToken) {
      config.accessToken = await askSecret(
        'Supabase personal access token (https://supabase.com/dashboard/account/tokens)'
      );
    }
    if (!config.projectName) {
      config.projectName = await ask('New project name', 'ai-design-paradigm');
    }
    if (!config.dbPass || config.dbPass.length < 8) {
      config.dbPass = await askSecret('Database password (min 8 characters)');
      if (config.dbPass.length < 8) throw new Error('Database password must be at least 8 characters.');
    }

    console.log('\nFetching organizations...\n');
    const orgs = await listOrganizations(config.accessToken);
    if (!orgs.length) throw new Error('No Supabase organizations found on this account.');

    let orgId = orgs[0].id;
    if (orgs.length > 1) {
      console.log('Organizations:');
      orgs.forEach((o, i) => console.log(`  [${i + 1}] ${o.name} (${o.id})`));
      const pick = await ask('Organization number', '1');
      const idx = Number(pick) - 1;
      orgId = orgs[idx]?.id ?? orgs[0].id;
    } else {
      console.log(`  Using organization: ${orgs[0].name}`);
    }

    console.log('\nCreating Supabase project (may take 1–3 minutes)...\n');
    const project = await createProject(config.accessToken, {
      organizationId: orgId,
      name: config.projectName,
      dbPass: config.dbPass
    });

    await waitForProjectReady(config.accessToken, project.ref);
    config.url = `https://${project.ref}.supabase.co`;
    config.anonKey = await getProjectApiKeys(config.accessToken, project.ref);
    console.log(`\n  Project ready: ${config.url}\n`);
  } else {
    if (!config.url) {
      config.url = await ask('Supabase Project URL (https://xxx.supabase.co)');
    }
    if (!config.anonKey) {
      config.anonKey = await askSecret('Supabase anon public key');
    }
    if (!config.accessToken) {
      const token = await ask(
        'Personal access token for schema apply (optional, press Enter to skip)',
        ''
      );
      config.accessToken = token;
    }
  }

  if (!config.url.includes('supabase.co')) {
    throw new Error('Invalid Supabase URL — expected https://<ref>.supabase.co');
  }
  if (!config.anonKey.startsWith('eyJ')) {
    console.warn('  ⚠ Anon key usually starts with eyJ — double-check you copied the anon public key.');
  }

  return config;
}

/** @param {Config} config */
async function writeEnvLocal(config) {
  const content = `# Generated by npm run supabase:init — do not commit
VITE_SUPABASE_URL=${config.url}
VITE_SUPABASE_ANON_KEY=${config.anonKey}
`;
  await writeText(ENV_FILE, content);
}

async function writeEnvExample() {
  const content = `# Copy to .env.local after npm run supabase:init
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
`;
  if (!(await fileExists(ENV_EXAMPLE))) {
    await writeText(ENV_EXAMPLE, content);
  }
}

/** @param {Config} config */
async function applySchema(config) {
  if (config.skipSchema) {
    console.log('\n  Skipped schema (--skip-schema).\n');
    return;
  }

  const sql = await readFile(SCHEMA_FILE, 'utf8');

  if (config.accessToken) {
    try {
      const ref = projectRefFromUrl(config.url);
      console.log('\nApplying supabase/schema.sql via Management API...\n');
      await runSql(config.accessToken, ref, sql);
      console.log('  ✔ Schema applied.');
      return;
    } catch (err) {
      console.warn(`  ⚠ API schema apply failed: ${err instanceof Error ? err.message : err}`);
      console.warn('  Apply manually in Dashboard → SQL Editor.\n');
    }
  }

  console.log('\n  Manual step: apply schema in Supabase Dashboard → SQL Editor');
  console.log(`  File: ${path.relative(ROOT, SCHEMA_FILE)}\n`);
}

/** @param {Config} config */
async function writeMarker(config) {
  const marker = {
    url: config.url,
    mode: config.mode,
    initializedAt: new Date().toISOString()
  };
  await writeText(MARKER, `${JSON.stringify(marker, null, 2)}\n`);
}

async function main() {
  const partial = parseArgs(process.argv.slice(2));

  if ((await fileExists(MARKER) || await fileExists(ENV_FILE)) && !partial.force) {
    console.error('\n✖ Supabase already initialized (.supabase-init.json or .env.local exists).');
    console.error('  Re-run with --force to overwrite.\n');
    process.exit(1);
  }

  console.log('\n Supabase init — AI Design Paradigm\n');

  const config = await resolveConfig(partial);

  console.log('\nInstalling @supabase/supabase-js...\n');
  await runCommand('npm', ['install', '@supabase/supabase-js']);

  console.log('\nWriting configuration...\n');
  await writeEnvLocal(config);
  await writeEnvExample();
  await applySchema(config);
  await writeMarker(config);

  console.log('\n✔ Supabase initialized.');
  console.log('  loginMachine now uses Supabase Auth when .env.local is loaded.');
  console.log('  E2E tests still use the demo stub (playwright.config.ts clears env).');
  console.log('\n  Next steps:');
  console.log('    1. Create a user in Supabase Dashboard → Authentication → Users');
  console.log('    2. npm run dev');
  console.log('    3. Sign in with real credentials\n');
}

main().catch((err) => {
  console.error(`\n✖ ${err instanceof Error ? err.message : err}\n`);
  process.exit(1);
});
