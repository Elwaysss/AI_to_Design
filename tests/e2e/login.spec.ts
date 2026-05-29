import { test, expect } from '@playwright/test';

/**
 * E2E spec for the LoginForm + loginMachine flow.
 *
 * Locators are role / label based (a11y first) so a future redesign that keeps
 * semantics intact does not break tests; the Playwright Healer agent rewrites
 * them otherwise (see docs/playwright-test-agents.md).
 *
 * The CTA color assertion is the canonical token-pipeline smoke check: if it
 * passes, DESIGN.md -> tokens/ -> Style Dictionary -> @theme -> rendered CSS
 * is healthy end to end.
 */
test.describe('login form', () => {
  test('renders idle state with disabled submit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  test('enables submit when valid input is provided', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correctpw');
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeEnabled();
  });

  test('submit button uses brand-primary token', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correctpw');
    const cta = page.getByRole('button', { name: 'Sign in' });
    const bg = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #B85230 — clay.500 after P3.2 Chromatic verify bump.
    expect(bg).toBe('rgb(184, 82, 48)');
  });

  test('shows error and recovers on retry when authenticate rejects', async ({ page }) => {
    // The stub in loginMachine.ts rejects any email containing 'fail'.
    // Password length / email format are already enforced by the looksValid
    // guard, so we cannot reach the failure state through those paths alone.
    await page.goto('/');
    await page.getByLabel('Email').fill('fail@example.com');
    await page.getByLabel('Password').fill('correctpw');
    await page.getByRole('button', { name: 'Sign in' }).click();
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/credentials/i);
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(alert).toBeHidden();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('reaches success state on valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correctpw');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
  });
});
