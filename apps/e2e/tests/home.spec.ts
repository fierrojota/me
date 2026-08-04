import { test, expect } from '@playwright/test';

// Coverage written at /j-flow-qa (per review-guide.md), not deferred further.
// Asserts the core ACs of 04-design-polish's `/` landing page against the
// real i18n copy in apps/web/public/locales/{en,es}/home.json.

test.describe('Home page', () => {
  test('header shows wordmark + nav links, brand link scrolls to Hero (AC-1)', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.site-header__brand-link')).toContainText('jotafierro.me');
    await expect(page.locator('.nav__link')).toHaveText(['00_INIT', '01_ABOUT', '02_SYSTEMS', '03_CONNECT']);

    // Scroll away from Hero first so the brand click has somewhere to go.
    await page.locator('#connect').scrollIntoViewIfNeeded();
    await page.locator('.site-header__brand-link').click();
    await page.waitForTimeout(600);
    await expect(page.locator('#init')).toBeInViewport();
  });

  test('hero headline and both CTAs are visible (AC-2)', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero__highlight')).toHaveText('HIGH PERFORMANCE.');
    await expect(page.getByRole('link', { name: 'INITIALIZE_VIEW_SYSTEMS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WHO_IS_THE_BUILDER?' })).toBeVisible();
  });

  test('builder section shows image + both stat cards (AC-3)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#the-builder').scrollIntoViewIfNeeded();

    await expect(page.locator('.builder__image')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CLEAN_ARCH' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'INNOVATION' })).toBeVisible();
  });

  test('all 4 project cards render as links with titles (AC-4)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#featured-systems').scrollIntoViewIfNeeded();

    const cards = page.locator('.project-card-cell');
    await expect(cards).toHaveCount(4);

    for (let i = 0; i < 4; i++) {
      expect(await cards.nth(i).evaluate((el) => el.tagName)).toBe('A');
    }

    // Exact heading match — a substring match on 'ME' would also hit
    // "developMEnt" in the AURA card's description.
    const titles = ['AURA', 'J-FLOW', 'SUPERCLEAN', 'ME'];
    for (const title of titles) {
      await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    }
  });

  test('Connect section: bordered CTA card + nested footer + email link, no separate CTA band/footer section (AC-5)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('#connect').scrollIntoViewIfNeeded();

    await expect(page.locator('.connect__card')).toBeVisible();
    await expect(page.getByText('BUILD_REMARKABLE_SYSTEMS_NOW')).toBeVisible();
    await expect(page.getByRole('link', { name: 'CONNECT@JOTAFIERRO.ME' })).toHaveAttribute(
      'href',
      'mailto:connect@jotafierro.me',
    );

    const footer = page.locator('#connect footer.connect__footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('jotafierro.me //');
    await expect(footer).not.toContainText('BUILT WITH KINETIC_LOGIC');
    await expect(footer.getByRole('link', { name: 'GITHUB' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'LINKEDIN' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'EMAIL' })).toBeVisible();

    // No separate full-bleed CTA band, and only this one <footer> on the page.
    await expect(page.locator('.cta-band')).toHaveCount(0);
    await expect(page.locator('footer')).toHaveCount(1);
  });

  test('clicking 03_CONNECT scrolls the Connect section into view uncovered by the sticky header (AC-1)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '03_CONNECT' }).click();
    await page.waitForTimeout(700);

    const headerBottom = await page.locator('.site-header').evaluate((el) => el.getBoundingClientRect().bottom);
    const connectTop = await page.locator('#connect').evaluate((el) => el.getBoundingClientRect().top);
    expect(connectTop).toBeGreaterThanOrEqual(headerBottom - 1);
  });

  test('selecting ES updates visible copy without a page reload (AC-11)', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      (window as unknown as { __noReloadMarker?: boolean }).__noReloadMarker = true;
    });

    await page.getByRole('button', { name: 'ES' }).click();
    await expect(page.locator('.hero__highlight')).toHaveText('ALTO RENDIMIENTO.');

    const markerSurvived = await page.evaluate(
      () => (window as unknown as { __noReloadMarker?: boolean }).__noReloadMarker,
    );
    expect(markerSurvived).toBe(true);
  });
});
