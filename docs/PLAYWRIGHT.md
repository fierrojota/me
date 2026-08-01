# Playwright E2E — me

End-to-end browser tests for the web stack in `apps/e2e`. Runs against the React + Vite web app at `http://localhost:3001`.

## Run

```bash
pnpm --filter @me/e2e test            # headless
pnpm --filter @me/e2e report          # open last HTML report
```

`playwright.config.ts` declares a `webServer` block that boots `pnpm --filter @me/web dev` automatically. No need to start the web app separately — locally Playwright reuses a running dev server if one is already up (`reuseExistingServer: !CI`); in CI it starts a fresh one.

## Where tests live

- `apps/e2e/tests/*.spec.ts` — test specs
- `apps/e2e/playwright.config.ts` — config (baseURL, projects, webServer)

## Adding a test

```ts
import { test, expect } from '@playwright/test';

test('users can sign in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('changeme');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

Prefer semantic selectors (`getByRole`, `getByLabel`, `getByText`) over CSS selectors.

## Browser binaries

Browser binaries are installed during scaffold via `pnpm exec playwright install chromium`. If a fresh clone is missing them:

```bash
cd apps/e2e && pnpm exec playwright install chromium
```

## Debugging

```bash
pnpm --filter @me/e2e exec playwright test --debug   # opens Inspector
pnpm --filter @me/e2e exec playwright codegen http://localhost:3001  # generate test from interactions
```

Failed runs save traces under `apps/e2e/test-results/`. Open one with:

```bash
pnpm --filter @me/e2e exec playwright show-trace test-results/<run>/trace.zip
```

## CI

Playwright runs in the GitHub Actions workflow at `.github/workflows/ci.yml`. CI installs browser binaries and runs `pnpm --filter @me/e2e test` against a fresh web server boot.
