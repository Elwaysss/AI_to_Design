import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { devServerUrl, getDevPortFromRoot } from './scripts/lib/dev-port.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = getDevPortFromRoot(root);
const baseURL =
  process.env.PREVIEW_URL?.trim() || process.env.BASE_URL?.trim() || devServerUrl(port);

/**
 * Playwright configuration.
 *
 * Tests live under tests/e2e/. Visual baselines are owned by Chromatic
 * (see .github/workflows/visual-regression.yml).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  /**
   * Auto-start the Vite dev server so `npm run test:e2e` works locally and
   * in CI without a separate orchestration step. `reuseExistingServer` keeps
   * local iteration fast: if you already ran `npm run dev`, Playwright reuses
   * that process instead of spawning a duplicate.
   */
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // Force demo auth stub during e2e — even if developer has .env.local with Supabase.
    env: {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: ''
    }
  },

  projects: process.env.CHROMATIC_PROJECT_TOKEN
    ? [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
        { name: 'mobile',   use: { ...devices['iPhone 14'] } }
      ]
});
