import { test, expect } from '@playwright/test';

// Regression test for a bug where the nav's scroll-tracked active-section
// underline would sometimes get stuck on the second-to-last section after
// clicking the first nav link then immediately clicking the last one — even
// though the page had genuinely scrolled all the way to the last section.
//
// Root cause: useActiveSection used to derive the active id from
// IntersectionObserver entries whose `intersectionRatio`/`boundingClientRect`
// are only refreshed when a target's isIntersecting flips. Under main-thread
// contention, a still-intersecting section's stale (higher) ratio could beat
// a freshly-entering section's near-zero ratio, and the browser could simply
// never schedule another intersection check once the page settled. CPU
// throttling below reproduces that contention reliably.
test('clicking first then last nav link lands the active-section underline on the last link', async ({
  page,
  browser,
}) => {
  test.skip(browser.browserType().name() !== 'chromium', 'CPU throttling is only available via CDP on Chromium');

  const attempts = 8;
  let stuckCount = 0;
  const cdp = await page.context().newCDPSession(page);

  for (let i = 0; i < attempts; i++) {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });

    await page.goto('/');
    const links = page.locator('.nav__link');
    await expect(links.first()).toBeVisible();

    // Rapid-fire: first link then immediately the last, no settle time in
    // between, to exercise the race rather than avoid it.
    await links.first().click();
    await links.last().click();

    // Let the smooth scroll + any observer/scroll recomputation settle.
    await page.waitForTimeout(1500);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    const lastLinkText = await links.last().textContent();
    const activeText = await page.locator('.nav__link[aria-current="page"]').textContent();
    if (activeText !== lastLinkText) stuckCount++;

    expect(activeText, `attempt ${i + 1}/${attempts}: active link should be the last one`).toBe(lastLinkText);

    // The underline indicator should be positioned under that same last link.
    const indicatorX = await page.evaluate(() => {
      const el = document.querySelector('.nav__indicator');
      const match = el?.getAttribute('style')?.match(/translateX\(([-\d.]+)px\)/);
      return match ? Number(match[1]) : null;
    });
    const lastLinkX = await links.last().evaluate((el, wrap) => {
      const wrapEl = el.closest('.nav__links-wrap') ?? wrap;
      return el.getBoundingClientRect().left - (wrapEl as HTMLElement).getBoundingClientRect().left;
    }, null);
    expect(indicatorX).not.toBeNull();
    expect(Math.abs((indicatorX ?? 0) - lastLinkX)).toBeLessThan(2);
  }

  expect(stuckCount, `underline got stuck in ${stuckCount}/${attempts} attempts`).toBe(0);
});
