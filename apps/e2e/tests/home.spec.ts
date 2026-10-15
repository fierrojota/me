import { test, expect } from '@playwright/test';

// Coverage written at /j-flow-qa (per review-guide.md), not deferred further.
// Asserts the core ACs of 04-design-polish's `/` landing page against the
// real i18n copy in apps/web/src/locales/{en,es}/home.json.

test.describe('Home page', () => {
  test('header shows wordmark + nav links, brand link scrolls to Hero (AC-1)', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.site-header__brand-link')).toContainText('fierrojota.com');
    await expect(page.locator('.nav__link')).toHaveText(['00_INICIALIZAR', '01_ACERCA', '02_SISTEMAS', '03_CONECTAR']);

    // Scroll away from Hero first so the brand click has somewhere to go.
    await page.locator('#connect').scrollIntoViewIfNeeded();
    await page.locator('.site-header__brand-link').click();
    await page.waitForTimeout(600);
    await expect(page.locator('#init')).toBeInViewport();
  });

  test('hero headline and both CTAs are visible (AC-2)', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero__highlight')).toHaveText('PROCESO A TODO');
    await expect(page.getByRole('link', { name: 'INICIALIZAR_VER_SISTEMAS' })).toBeVisible();
    await expect(page.getByRole('link', { name: '¿QUIÉN_ES_EL_CONSTRUCTOR?' })).toBeVisible();
  });

  test('builder section shows image + both stat cards (AC-3)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#the-builder').scrollIntoViewIfNeeded();

    await expect(page.locator('.builder__image')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ARQUITECTURA_LIMPIA' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'INNOVACIÓN' })).toBeVisible();
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
    // words like "developMEnt" in a card's description.
    const titles = ['NOW', 'J-FLOW', 'SUPERCLEAN', 'ME'];
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
    await expect(page.getByText('HABLEMOS')).toBeVisible();
    await expect(page.getByRole('link', { name: 'CONNECT@FIERROJOTA.COM' })).toHaveAttribute(
      'href',
      'mailto:connect@fierrojota.com',
    );

    const footer = page.locator('#connect footer.connect__footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('fierrojota.com //');
    await expect(footer).not.toContainText('BUILT WITH KINETIC_LOGIC');
    await expect(footer.getByRole('link', { name: 'GITHUB' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'LINKEDIN' })).toBeVisible();
    const youtube = footer.getByRole('link', { name: 'YOUTUBE' });
    await expect(youtube).toHaveAttribute('href', 'https://www.youtube.com/@fierrojota');
    await expect(youtube).toHaveAttribute('target', '_blank');
    await expect(youtube).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(footer.getByRole('link', { name: 'EMAIL' })).toBeVisible();

    // No separate full-bleed CTA band, and only this one <footer> on the page.
    await expect(page.locator('.cta-band')).toHaveCount(0);
    await expect(page.locator('footer')).toHaveCount(1);
  });

  test('clicking 03_CONECTAR scrolls the Connect section into view uncovered by the sticky header (AC-1)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '03_CONECTAR' }).click();
    await page.waitForTimeout(700);

    const headerBottom = await page.locator('.site-header').evaluate((el) => el.getBoundingClientRect().bottom);
    const connectTop = await page.locator('#connect').evaluate((el) => el.getBoundingClientRect().top);
    expect(connectTop).toBeGreaterThanOrEqual(headerBottom - 1);
  });

  test('Spanish is forced for an English visitor with stored en (AC-1, AC-2)', async ({ browser }) => {
    const context = await browser.newContext({ locale: 'en-US' });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('.hero__highlight')).toHaveText('PROCESO A TODO');
    await expect(page.locator('.language-toggle')).toHaveCount(0);
    await context.close();
  });

  test('mobile menu has no language toggle (AC-2)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('summary.nav__toggle').click();

    const links = page.locator('.nav__link');
    await expect(links).toHaveCount(4);
    for (let i = 0; i < 4; i++) await expect(links.nth(i)).toBeVisible();
    await expect(page.locator('.nav__link[aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('.language-toggle')).toHaveCount(0);
  });
});
