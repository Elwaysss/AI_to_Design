import { defineConfig, devices } from '@playwright/test';

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
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:5173',
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
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'mobile',   use: { ...devices['iPhone 14'] } }
  ],

  // Wire Playwright Test Agents (Planner / Generator / Healer) here when adopted.
  // Docs: https://playwright.dev/docs/test-agents
  // agents: { planner: 'planner.md', generator: 'generator.md', healer: 'healer.md' }
});
