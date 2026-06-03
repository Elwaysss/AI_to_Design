/**
 * Supabase Management API helpers for `npm run supabase:init`.
 * @see https://supabase.com/docs/reference/api/introduction
 */

const API_BASE = 'https://api.supabase.com/v1';

/** @param {string} token */
function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

/** @param {string} token */
export async function listOrganizations(token) {
  const res = await fetch(`${API_BASE}/organizations`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`Failed to list organizations (${res.status}): ${await res.text()}`);
  }
  /** @type {{ id: string, name: string }[]} */
  const data = await res.json();
  return data;
}

/**
 * @param {string} token
 * @param {{ organizationId: string, name: string, dbPass: string, region?: string }} opts
 */
export async function createProject(token, opts) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({
      organization_id: opts.organizationId,
      name: opts.name,
      db_pass: opts.dbPass,
      region: opts.region ?? 'ap-southeast-1'
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to create project (${res.status}): ${await res.text()}`);
  }

  return /** @type {{ id: string, ref: string, name: string }} */ (await res.json());
}

/** @param {string} token @param {string} ref */
export async function getProject(token, ref) {
  const res = await fetch(`${API_BASE}/projects/${ref}`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`Failed to get project (${res.status}): ${await res.text()}`);
  }
  return /** @type {{ id: string, ref: string, status: string }} */ (await res.json());
}

/**
 * Poll until project is ACTIVE_HEALTHY or timeout.
 * @param {string} token @param {string} ref @param {number} timeoutMs
 */
export async function waitForProjectReady(token, ref, timeoutMs = 180_000) {
  const start = Date.now();
  while Date.now() - start < timeoutMs) {
    const project = await getProject(token, ref);
    if (project.status === 'ACTIVE_HEALTHY') return project;
    if (project.status === 'INACTIVE' || project.status === 'REMOVED') {
      throw new Error(`Project entered terminal status: ${project.status}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Project ${ref} did not become ACTIVE_HEALTHY within ${timeoutMs / 1000}s`);
}

/** @param {string} token @param {string} ref */
export async function getProjectApiKeys(token, ref) {
  const res = await fetch(`${API_BASE}/projects/${ref}/api-keys`, { headers: headers(token) });
  if (!res.ok) {
    throw new Error(`Failed to get API keys (${res.status}): ${await res.text()}`);
  }
  /** @type {{ name: string, api_key: string }[]} */
  const keys = await res.json();
  const anon = keys.find((k) => k.name === 'anon' || k.name === 'anon key');
  if (!anon) throw new Error('Anon API key not found on project.');
  return anon.api_key;
}

/**
 * Run SQL against project database via Management API.
 * @param {string} token @param {string} ref @param {string} query
 */
export async function runSql(token, ref, query) {
  const res = await fetch(`${API_BASE}/projects/${ref}/database/query`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    throw new Error(`Failed to run SQL (${res.status}): ${await res.text()}`);
  }

  return res.json();
}

/** Extract project ref from Supabase URL. @param {string} url */
export function projectRefFromUrl(url) {
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  if (!match) throw new Error(`Invalid Supabase URL: ${url}`);
  return match[1];
}
