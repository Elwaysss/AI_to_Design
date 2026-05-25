import { test, expect } from '@playwright/test';

/**
 * Example E2E spec.
 *
 * Demonstrates the minimum quality bar enforced by Phase 3:
 *   1. Brand-driven CTA is reachable by role + accessible name.
 *   2. Computed CTA background equals the brand primary token.
 *   3. Page passes a quick visual snapshot (handed off to Chromatic in CI).
 */
test.describe('home page', () => {
  test('CTA renders with brand-primary background', async ({ page }) => {
    await page.goto('/');

    const cta = page.getByRole('button', { name: /get started/i });
    await expect(cta).toBeVisible();

    // Token assertion — the rendered CSS variable resolves to Boston Clay.
    const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    // rgb(184, 66, 46) == #B8422E
    expect(bg).toBe('rgb(184, 66, 46)');
  });

  test('viewport snapshot matches baseline', async ({ page }) => {
    await page.goto('/');
    // Chromatic intercepts and uploads this. Local runs use Playwright's own snapshot.
    await expect(page).toHaveScreenshot('home.png', { maxDiffPixelRatio: 0.01 });
  });
});
