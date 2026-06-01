/**
 * Minimal YAML parser for awesome-design-md frontmatter.
 * Handles nested objects (2-space indent), quoted strings, arrays, and scalars.
 * Not a general-purpose YAML implementation — tuned for design-md sources.
 */

/** @param {string} raw */
export function splitFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: null, body: raw, yaml: '' };
  }
  return { frontmatter: match[1], body: match[2], yaml: match[1] };
}

/**
 * @param {string} yaml
 * @returns {Record<string, unknown>}
 */
export function parseYaml(yaml) {
  const lines = yaml.split('\n');
  /** @type {Record<string, unknown>} */
  const root = {};
  /** @type {{ obj: Record<string, unknown>, indent: number }[]} */
  const stack = [{ obj: root, indent: -1 }];

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let rest = trimmed.slice(colonIdx + 1).trim();

    if (rest === '' || rest === '|' || rest === '>') {
      /** @type {Record<string, unknown>} */
      const child = {};
      parent[key] = child;
      stack.push({ obj: child, indent });
      continue;
    }

    parent[key] = parseScalar(rest);
  }

  return root;
}

/** @param {string} value */
function parseScalar(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseScalar(s.trim()));
  }

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;

  const num = Number(value);
  if (!Number.isNaN(num) && value !== '') return num;

  return value;
}

/**
 * Flatten nested typography entries into { role: { fontFamily, fontSize, ... } }.
 * @param {Record<string, unknown>} data
 */
export function getTypographyRoles(data) {
  const typo = data.typography;
  if (!typo || typeof typo !== 'object') return {};
  return /** @type {Record<string, Record<string, string>>} */ (typo);
}

/**
 * @param {Record<string, unknown>} data
 * @returns {Record<string, string>}
 */
export function getColorMap(data) {
  const colors = data.colors;
  if (!colors || typeof colors !== 'object') return {};
  return /** @type {Record<string, string>} */ (colors);
}
