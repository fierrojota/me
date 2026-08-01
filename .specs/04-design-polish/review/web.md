# Manual Testing — 04-design-polish Web

Browser smoke tests. Run against local dev stack.

## Setup

```bash
pnpm --filter @me/web dev     # :3001
```

No Mailhog/API — this feature has no backend.

---

## 1. Header/Nav (AC-1)

1. Open http://localhost:3001/
2. Observe the header: brand mark + "jotafierro.me" wordmark, `00_INIT` / `01_ABOUT` / `02_SYSTEMS` / `03_CONNECT` links **horizontally centered** in the header, language toggle — **no `CONNECT.EXE` button** (removed)
2b. Scroll down the page, then click the brand (logo + wordmark): expected it scrolls back to the Hero section (`#init`), same destination as `00_INIT` — DevTools → Elements: confirm the brand is wrapped in a real `<a href="#init">`, not just a styled `<div>`
3. Expected: header content spans the full browser width edge-to-edge (only page-margin side padding, no `container-max` 1280px clamp) — confirm on a wide monitor (≥1600px) that the header doesn't stop short with visible empty space on either side
4. Expected: all render; `01_ABOUT` scrolls (smoothly) to the Builder section, `02_SYSTEMS` scrolls to Featured Systems, `03_CONNECT` scrolls to the Connect section
5. Resize the viewport wider/narrower — the nav links stay centered on the full header width regardless of brand/language-toggle widths on either side
6. Scroll down the page — the header stays fixed/sticky to the top of the viewport at all times
7. Click each nav link from a scrolled-down position — confirm the target section's heading is NOT hidden underneath the sticky header (scroll-margin-top offset working)
8. Tab through the header with keyboard only — every link/toggle shows a visible focus ring, in source order
9. Resize below 768px: expected the nav links/language toggle collapse behind a hamburger icon (top-right, per `docs/mockups/web/mobile.png`); brand stays visible top-left
10. Click/tap the hamburger: expected the menu opens (native `<details>` — DevTools → Elements: confirm the `open` attribute appears), showing `01_ABOUT`/`02_SYSTEMS`/`03_CONNECT` + the language toggle stacked vertically
11. Keyboard: Tab to the hamburger, press Enter/Space — same open behavior; confirm a visible focus ring on the toggle itself
12. Resize back to ≥768px with the menu open: expected it reverts to the inline centered nav (no leftover open-menu artifact)
13. At ≥768px, scroll the page freely (not via nav-link click): expected a lime underline slides smoothly under whichever of `00_INIT`/`01_ABOUT`/`02_SYSTEMS`/`03_CONNECT` corresponds to the section currently in view — no underline while Footer is in view
14. Click a nav link directly (e.g. `02_SYSTEMS` from the top of the page): expected the underline animates to that link too, not just on free scroll
15. macOS: System Settings → Accessibility → Display → Reduce Motion (or DevTools → Rendering → emulate `prefers-reduced-motion: reduce`): expected the underline still repositions correctly but without the sliding animation
16. Below 768px (hamburger open): expected the active-section link shows the lime color/`aria-current` state but NO sliding underline element

---

## 2. Hero (AC-2)

1. Open http://localhost:3001/
2. Observe the hero: `[ STATUS: HIGH_PERFORMANCE_LOGIC ]` chip, headline with "HIGH PERFORMANCE." in lime + underline, subcopy, two CTAs
3. Expected: `INITIALIZE_VIEW_SYSTEMS` scrolls to Featured Systems, `WHO_IS_THE_BUILDER?` scrolls to the Builder section
4. DevTools → Elements: confirm CTAs are `<a>` tags, not `<button>`

---

## 3. Builder / About (AC-3)

1. Scroll to "THE_BUILDER" section
2. Expected: builder image renders (no layout shift as it loads — throttle network in DevTools to confirm), role/specialization/philosophy bullets, pull-quote, two stat cards (`CLEAN_ARCH`, `INNOVATION`)
3. Expected: ONE bordered frame wraps the whole image+text card (not a separate border around the image alone)
4. DevTools → Elements: confirm `<img>` has non-empty `alt` and `loading="lazy"` — no `width`/`height` attributes (removed; they were the root cause of the image-overflow bug)
5. At ≥1024px: expected the image column and text column are exactly the same height (image cover-crops to match, never taller than text); text content (heading/bullets/quote/cards) is vertically centered within that shared height — no large empty gap below the stat cards
6. Resize to tablet width (768–1023px): expected side-by-side layout (text left, image right, per `docs/mockups/web/tablet.png`) — NOT stacked; image/text heights don't need to match at this tier (AC-3's height-matching is desktop-only)
7. Resize below 768px: expected stacked layout, image above text (per `docs/mockups/web/mobile.png`)
8. Expected: the `CURRENT_ROLE` fact reads "Backend Developer / Fz Sports" (not `Fz_Sports`) with "Fz Sports" rendered as a real, underlined, lime-colored link
9. Click "Fz Sports": expected it opens `https://www.fzsports.com/` in a NEW tab. DevTools → Elements: confirm `target="_blank"` and `rel="noopener noreferrer"` are both present
10. Tab to the "Fz Sports" link with keyboard only: confirm a visible focus ring

---

## 4. Featured Systems (AC-4, AC-8)

1. Scroll to "FEATURED_SYSTEMS"
2. Expected: heading + subcopy, `OPEN_GITHUB [ALL]` link (→ `https://github.com/jotafierro`), 4 real project cards: `SUPERCLEAN`, `R_BACKEND_TASK_TRACKER_CLI`, `J_UTILS`, `WRAPPER_PATH` — no more `AURA_CORE`/`KINETIC_UI`/`FZ_CONNECT`/`NEBULA_FLUX_PIPELINE` placeholders
3. Resize viewport to desktop (≥1024px): `SUPERCLEAN` (weight 800) renders visibly larger than the other 3, occupying roughly the left half of the section; `R_BACKEND_TASK_TRACKER_CLI` (weight 450) renders as a mid-sized card; `J_UTILS`/`WRAPPER_PATH` (weight 200 each) render as two small, EQUAL-size cards — no gaps or overlap between any of the 4
4. DevTools → Elements: confirm each `.project-card-cell` has inline `--rect-top`/`--rect-left`/`--rect-width`/`--rect-height` custom properties, and `SUPERCLEAN`'s computed area (width × height) is clearly larger than `J_UTILS`'s
5. **Dynamic recompute check (the actual point of this revision):** temporarily edit `apps/web/src/data/projects.ts` locally — remove 2 projects (down to 2 total) — reload, and confirm the remaining 2 cards resize to split the section proportionally with no gaps, no manual CSS change needed. Then restore to 4, add a 5th temporary entry, reload, and confirm all 5 lay out with no gaps/overlap. Revert the file when done
6. At ≥1024px: confirm all 4 real projects render via the SVG glyph fallback (none have a screenshot image) — glyph is small (40×40), doesn't stretch to fill its card
7. At ≥1024px, temporarily lengthen one card's description text (e.g. paste in 2-3 extra sentences via DevTools) and confirm that ONE card shows its own internal scrollbar (`overflow-y: auto`) rather than pushing the whole grid/section taller
8. Resize to tablet (768–1023px): expected a uniform 2-column grid — every card the SAME size (no large/medium/small tiering below desktop), natural content height, not fixed
9. Resize to mobile (<768px): all 4 cards stack full-width single column, no overlap/clipping
10. Confirm the section's total height still measures exactly `100vh − header height` at ≥1024px (AC-13/CONSTITUTION P5 unaffected by the sizing-mechanism change)
11. Click anywhere on a card (not just the title) — e.g. the description text or empty space — expected it opens that project's GitHub repo in a NEW tab. DevTools → Elements: confirm `target="_blank"` and `rel="noopener noreferrer"` on the card's outer `<a>`
12. Hover over a card: expected the card's border shifts to lime (`var(--primary-container)`). Tab to a card with keyboard only: expected a visible lime outline (`:focus-visible`), same treatment as other interactive elements on the page
13. DevTools → Accessibility tree: confirm each card's accessible name is just the project title (e.g. "SUPERCLEAN"), not the full chip+title+description text concatenated

---

## 5. Connect (AC-5, was Challenges/Desafíos — AC-6 CTA band and AC-7 Footer both merged in, no longer separate sections)

1. Click `03_CONNECT` in the nav
2. Expected: a bordered CTA card (dark background, thin border — NOT full-bleed lime), centered content: `BUILD_REMARKABLE_SYSTEMS_NOW` headline, subtitle ("Currently accepting select engineering partnerships for Q4 2024. Let's build something that lasts."), `CONNECT@JOTAFIERRO.ME` email button, `AWAITING_INCOMING_CONNECTION...` microcopy
3. Click the email CTA: expected to open the default mail client via `mailto:connect@jotafierro.me`
4. Confirm there is NO separate full-bleed lime CTA band anywhere else on the page (deleted, merged into this section)
5. Below the CTA card, in the SAME section: expected "jotafierro.me // {current year}" brand + `GITHUB`/`LINKEDIN`/`EMAIL` links — NO tagline (`BUILT WITH KINETIC_LOGIC...` is gone entirely, not relocated)
6. Expected: this footer row spans the FULL browser width edge-to-edge (like the header), NOT clamped to the CTA card's narrower bordered box — check on a wide monitor (≥1600px) that it stretches all the way, matching the header's own full-bleed treatment
7. Confirm the footer does NOT stick/float (scrolls normally with the page, unlike the sticky header)
8. Confirm there is no separate Footer section/element after Connect — Connect is the last thing on the page
9. At ≥1024px: confirm the CTA card + footer content together still fit within one viewport height (per AC-13), no overflow past the section
10. DevTools → Elements/Accessibility tree: confirm the nested `<footer>` here does NOT expose a `contentinfo` landmark role (a known, accepted consequence of nesting it inside `<section>`/`<main>` — the page has zero `contentinfo` landmarks now, not a bug)

---

## 8. Responsive fidelity (AC-8)

1. Resize the viewport across desktop (1440px), tablet (768px), and mobile (375px)
2. Expected: no section breaks, overlaps, or horizontal scroll at any width; visual intent matches `docs/mockups/web/me.png` (desktop reference)

---

## 9. Accessibility baseline (AC-9)

1. DevTools → Elements/Accessibility tree: confirm exactly one `<header>` (`banner`), one `<nav>` (`navigation`), one `<main>` landmark — and confirm there is NO `contentinfo` landmark anymore (revision 9: the `<footer>` nested inside Connect's `<section>` loses its implicit `contentinfo` role per the ARIA-in-HTML spec — this is an accepted trade-off of merging Footer into Connect, not a regression to fix)
2. Tab through the entire page: every interactive element (nav links, brand link, CTAs, footer links) receives a visible `:focus-visible` ring, no keyboard trap
3. Run Storybook's `@storybook/addon-a11y` axe check (or browser axe extension) against the rendered page — 0 violations (a missing `contentinfo` landmark is not itself an axe violation)

---

## 10. Icon / Favicon (AC-10)

1. Check the browser tab: favicon matches the branded icon (not the Vite/React default)
2. DevTools → Network → filter `favicon`/`icon`/`manifest`: confirm `favicon.ico`, `apple-touch-icon.png`, and `manifest.json` all return 200
3. DevTools → Application → Manifest: confirm `icon-192.png`, `icon-512.png`, and maskable variants are listed and load

---

## 11. Language toggle (AC-11)

1. Open http://localhost:3001/ with your browser's language set to Spanish (or override via DevTools → Sensors → Locale, or `navigator.language`)
2. Expected: the toggle renders as a bordered box with a globe icon + `EN` / `ES` buttons (not a dropdown `<select>`); `ES` shows highlighted lime/active on first load (no prior localStorage value)
3. DevTools → Elements: confirm both are real `<button>` elements with `aria-pressed` (true on the active one), inside a `role="group"` wrapper — not a `<select>`
4. Click `EN`: expected every section's copy (header, hero, builder, featured systems, connect, footer) updates live to English, no page reload, and `EN` becomes the highlighted/active button
5. Reload the page: expected `EN` stays active (persisted via localStorage)
6. Switch back to `ES`: expected all copy translates back correctly — spot-check for any English string left untranslated (translation-fidelity risk from functional spec)
7. Resize to mobile width with `ES` active: confirm longer Spanish strings (e.g. `¿QUIÉN_ES_EL_CONSTRUCTOR?`) wrap without clipping/overflow
8. Open Storybook (`pnpm --filter @me/ui storybook`) and confirm `LanguageToggle` has its own catalog entry with `English`/`Spanish` stories

---

## 12. Visual rhythm & background pattern (AC-12)

1. Open http://localhost:3001/ and scroll through the whole page
2. Expected: a subtle dot-grid pattern is visible behind all page content (not a raster image — DevTools → Network → filter `img`/pattern: confirm no new image request for it)
3. Expected: sections no longer read as visually cramped/coupled — each section has clearly increased breathing room (64px mobile / 128px desktop) between its content and the next section's
4. In the Hero specifically, compare against `docs/mockups/web/me.png`: the gap between the headline and subcopy, and between the subcopy and the CTA row, should visually match the mockup's proportions (not just look "less cramped" than before)

---

## 13. Full-height scroll-snap sections, desktop only (AC-13)

1. Open http://localhost:3001/ on a normal desktop viewport (e.g. 1440×900)
2. Click `00_INIT`: expected Hero fills EXACTLY the viewport height below the header — not taller, not shorter (check with DevTools: section height should equal `viewport height − header height`, e.g. 900−72=828px)
3. Click `01_ABOUT`: expected Builder fills exactly that same height, image/text columns matching (see scenario 3) — no Featured Systems content ever peeking in below the fold, and no dead space/scroll past Builder's own content
4. Click `02_SYSTEMS`: expected Featured Systems fills exactly that height, 3 small cards evenly dividing the space next to the large card — no card visibly clipped, no dead space below the grid
5. Click `03_CONNECT`: expected Connect fills exactly that height, content centered (no longer top-anchored with dead space below)
6. Manually scroll (mouse wheel/trackpad) slowly through the whole page: expected scrolling feels free between the 4 full-height sections (Hero/Builder/FeaturedSystems/Connect) and Footer, gently resting on each of the 4 sections' boundaries — should NOT feel like it's fighting your scroll or trapping you on one section
7. On a shorter viewport (resize browser window notably shorter, e.g. 900×500), confirm sections NO LONGER grow taller than the viewport — instead, if a section's content doesn't fit, that ONE section shows its own internal scrollbar (`overflow-y: auto`) rather than pushing the section boundary down or clipping content with no way to reach it
8. Confirm the existing nav-click smooth-scroll (from scenario 1) still works correctly with scroll-snap active — no visual glitch/double-jump
9. Resize below 1024px (tablet/mobile): expected all 4 sections NO LONGER force full viewport height — they render at natural content height and scroll normally, no snapping, no forced 100vh (this is the desktop-only scoping — confirm it doesn't still trigger below 1024px)

---

## 14. Dependency removal (Scope, no dedicated AC)

1. Confirm `tailwindcss`, `zod`, `zustand` are gone from `apps/web/package.json`
2. Run `pnpm --filter @me/web build`, `pnpm --filter @me/web type-check`, `pnpm --filter @me/web lint` — all three must pass clean

---

## SEO meta tags (constraint, no dedicated AC)

1. View page source (`Ctrl/Cmd+U`)
2. Confirm `<title>`, `<meta name="description">`, and `og:title`/`og:description`/`og:type`/`og:url`/`og:image` tags are present with real copy (not placeholder text)

---

## Checklist

| AC | Scenario | Pass |
|----|----------|------|
| AC-1 | Header/Nav renders full-bleed (no CONNECT.EXE), 4 links (incl. 00_INIT→Hero, 03_CONNECT→Connect) centered ≥768px, hamburger disclosure <768px, sticky on scroll, scroll-tracked animated underline (reduced-motion respected), keyboard-navigable | [ ] |
| AC-2 | Hero renders with correct CTAs | [x] |
| AC-3 | Builder: one outer frame, image/text columns match height + centered text at ≥1024px, no layout shift, side-by-side ≥768px / stacked <768px, Fz Sports company link works | [x] |
| AC-4 | Featured Systems: real project data, treemap sizing proportional to weight (recomputes for any project count), correct grid at all 3 breakpoints, cards clickable to their url (new tab), hover/focus affordance, concise accessible name | [x] |
| AC-5 | Connect: bordered CTA card (headline/subtitle/email/status, not full-bleed lime) + full-bleed non-fixed footer (brand/links, no tagline), email link works, no separate CTA band/Footer section exists | [x] |
| AC-8 | Responsive at desktop/tablet/mobile, no overlap | [x] |
| AC-9 | header/nav/main landmarks present (no contentinfo — accepted), focus-visible everywhere, axe 0 violations | [ ] |
| AC-10 | Favicon/manifest/icons wired and load | [x] |
| AC-11 | LanguageToggle (2 buttons, globe icon) detects browser locale, switches all copy live, persists, has Storybook story | [x] |
| AC-12 | Dot-grid background visible (CSS, no new asset), section spacing matches mockup proportions | [x] |
| AC-13 | Hero/Builder/FeaturedSystems/Connect hard-capped at exactly viewport height (never taller) at ≥1024px, content fills/fits or falls back to per-section scroll, natural height below 1024px, doesn't feel trapped | [ ] |
| — | tailwindcss/zod/zustand removed, build/type-check/lint pass | [x] |
