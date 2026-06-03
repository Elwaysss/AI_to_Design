import { test, expect } from '@chromatic-com/playwright';

test.describe('onboarding panel', () => {
  test('completes welcome → theme → success flow', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Quick setup' })).toBeVisible();

    await page.getByLabel('Display name').fill('Alex');
    await page.getByRole('button', { name: 'Continue' }).click();

    await page.getByRole('button', { name: 'Dark' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    await expect(page.getByText(/Welcome, Alex \(dark theme\)/)).toBeVisible();
  });
});
