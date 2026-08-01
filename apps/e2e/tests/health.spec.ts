import { test, expect } from '@playwright/test';

// Minimal smoke check: the app loads and serves the real page. Detailed
// section/copy assertions live in home.spec.ts — kept intentionally thin here.
test('homepage loads successfully with the expected title', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/Jota Fierro/);
});
