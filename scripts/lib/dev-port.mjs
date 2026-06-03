/**
 * Deterministic dev server port from package.json "name".
 * Lets multiple template forks run `npm run dev` in parallel without colliding.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const DEV_PORT_BASE = 5173;
export const DEV_PORT_RANGE = 1000;

/** @param {string} packageName */
export function hashPackageNameToOffset(packageName) {
  let h = 0;
  for (let i = 0; i < packageName.length; i++) {
    h = (Math.imul(31, h) + packageName.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % DEV_PORT_RANGE;
}

/** @param {string} packageName */
export function getDevPort(packageName) {
  return DEV_PORT_BASE + hashPackageNameToOffset(packageName);
}

/** @param {string} root Absolute path to repo root */
export function getDevPortFromRoot(root) {
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return getDevPort(pkg.name ?? 'app');
}

/** @param {number} port */
export function devServerUrl(port) {
  return `http://127.0.0.1:${port}`;
}
