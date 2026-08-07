# Functional Spec — Design polish (landing route `/`)
Date: 2026-07-25

## Purpose

Build the site's landing route (`/`) to match the approved visual design in `docs/mockups/web/me.png`, using `DESIGN.md` tokens and the `packages/ui` primitives already built in `03-design-system`. Establishes the visual-fidelity baseline for `/` that later iterations polish against.

## Feature users

Public visitors — recruiters, collaborators, clients (per `PRODUCT.md` audience). Anonymous, no auth.

## Trigger

Visiting `/` in a browser.

## Acceptance criteria

### AC-1 — Header/Nav

**Given** a visitor loads `/`
**When** the page renders
**Then:**
- Header shows logo mark (see AC-10) + "jotafierro.me" wordmark
- Clicking the brand (logo + wordmark) scrolls to the Hero section (`#init`), same destination as `00_INIT`
- Nav links render: `00_INIT` (scrolls to the Hero section), `01_ABOUT`, `02_SYSTEMS`, `03_CONNECT`
- Active/current nav link renders in lime (`primary-container`)
- An underline indicator renders under whichever nav link corresponds to the section currently in view (Hero for `00_INIT`, Builder for `01_ABOUT`, Featured Systems for `02_SYSTEMS`, Connect for `03_CONNECT`) — tracks scroll position as the visitor scrolls freely, not only on nav-link click
- The underline animates (slides/resizes) smoothly when moving from one active section to another, rather than jumping instantly
- All header links/buttons are keyboard-navigable with visible focus
- Header stays fixed to the top of the viewport while the page scrolls
- `00_INIT` scrolls to the Hero section, `01_ABOUT` scrolls to the Builder section, `02_SYSTEMS` scrolls to the Featured Systems section, `03_CONNECT` scrolls to the Connect section
- Nav-link scrolling animates smoothly, and the scrolled-to section's content is never obscured under the fixed header
- The header's content spans the full viewport width (not clamped to the page's `container-max` width) with page-margin side padding, matching the mockup's edge-to-edge header
- Nav links render horizontally centered on that full header width (between the brand mark and the language toggle), independent of viewport size
- Below the tablet breakpoint (per `docs/mockups/web/mobile.png`), the nav links collapse behind a hamburger/menu toggle — same nav content (`01_ABOUT`/`02_SYSTEMS`/`03_CONNECT`, language toggle), just collapsed; toggle is keyboard-operable, no custom JS focus-trap (native disclosure pattern preferred, per AC-9)
- In the collapsed mobile menu, the active-section link still shows the lime color + underline state (no slide animation required there — vertical single-column list, not a moving indicator)

### AC-2 — Hero

**Given** a visitor loads `/`
**When** the hero section renders
**Then:**
- Status chip renders: `[ STATUS: HIGH_PERFORMANCE_LOGIC ]`
- Headline renders with the "HIGH PERFORMANCE." phrase in lime with underline, rest in default text color, per mockup
- Subcopy paragraph renders below headline
- Primary CTA (`INITIALIZE_VIEW_SYSTEMS`) and secondary CTA (`WHO_IS_THE_BUILDER?`) render per Button primitive variants (03-design-system AC-2)

### AC-3 — About/Builder

**Given** a visitor scrolls to the "THE_BUILDER" section
**When** the section renders
**Then:**
- `docs/mockups/web/the_builder.webp` renders as the section image (already optimized via Squoosh — used as-is, no re-encoding), `object-fit: cover` filling a designated image container rather than a fixed portrait aspect-ratio crop
- Role/specialization/philosophy bullet list renders (`CURRENT_ROLE`, `SPECIALIZATION`, `PHILOSOPHY`) — philosophy copy states an actual engineering value/approach ("Simplicity Over Cleverness"), not the site's own design/brand name ("Kinetic Logic")
- The `CURRENT_ROLE` fact's company name renders as "Fz Sports" (not `Fz_Sports`) and is a link to `https://www.fzsports.com/` (opens in a new tab, `rel="noopener noreferrer"`)
- Role/specialization/philosophy/quote/stat content is sourced from a local, typed data module (mirrors AC-4's data-driven pattern) rather than hardcoded per-field i18n-only strings — so a future backend/admin can manage the same shape without a component rewrite
- Pull-quote renders below the list
- Two stat cards render (`01_PRACTICE` / `CLEAN_ARCH`, `02_VELOCITY` / `INNOVATION`) using the Card primitive
- The whole section content (image + text column together) renders inside one bordered frame matching the mockup — not a separate border around the image alone
- On desktop (≥1024px), the image column and text column match each other's height (image fills its side via `object-fit: cover`, cropping as needed — never dictating a taller box than the text side); the text column's content is vertically centered within that shared height, so no large empty gap appears below the stat cards

### AC-4 — Featured Systems

**Given** a visitor scrolls to "FEATURED_SYSTEMS"
**When** the section renders
**Then:**
- Section heading + subcopy render, plus `OPEN_GITHUB [ALL]` link
- Projects render from a data source (array of project objects: `id`, `tag`, `title`, `description`, `imageAlt`, `weight`, `url`, optional `image`) — not hardcoded per-card JSX — so a future admin/CMS can create/edit projects by producing the same shape
- Project list reflects the author's real public repositories at `github.com/jotafierro` (not placeholder names) — the set is curated with the author and evolves as more work is published. Current set:
  - `superclean` — weight 800 — `CLI_TOOLS` — "Command-line utility for clearing macOS caches, logs, and system trash" — `https://github.com/jotafierro/superclean`
  - `r-backend-task-tracker-cli` — weight 450 — `CLI_TOOLS` — "Backend task-tracker CLI solving roadmap.sh's Backend track — command parsing, JSON persistence, CRUD via terminal" — `https://github.com/jotafierro/r-backend-task-tracker-cli`
  - `j-utils` — weight 200 — `DEV_UTILS` — "TypeScript utilities and proof-of-concept experiments" — `https://github.com/jotafierro/j-utils`
  - `wrapper-path` — weight 200 — `DEV_UTILS` — "Lightweight wrapper around Node's `path` module" — `https://github.com/jotafierro/wrapper-path`
- Each project's card area is exactly proportional to its `weight` relative to the sum of all weights currently in the list (not a fixed tier system) — this recomputes automatically for any number of projects (2, 3, 5, 6, ...): equal weight → equal area, a dominant weight → proportionally larger area, always tiling the section's full space with no gaps, for any curated project count
- Each card shows a tag chip (e.g. `[ SYSTEM_ARCH ]`), title, and description text
- Each project has a `url` field (its own GitHub repo link, or any other link the author wants to share for that project) — clicking anywhere on the card navigates to that `url`, opening in a new tab

### AC-5 — Connect (was Challenges/Desafíos)

**Given** a visitor scrolls to the `03_CONNECT` section
**When** the section renders
**Then:**
- The section renders as a bordered/framed box (not full-bleed lime background) matching `docs/mockups/web/tablet.png`'s "READY TO OPTIMIZE?"-style CTA card — dark background, thin border, centered content
- Headline (`BUILD_REMARKABLE_SYSTEMS_NOW`) renders, centered
- A subtitle renders between the headline and the email CTA: "Currently accepting select engineering partnerships for Q4 2024. Let's build something that lasts." (per `docs/mockups/web/tablet.png`'s CTA card copy)
- Email CTA button (`CONNECT@JOTAFIERRO.ME`) renders, centered
- Status microcopy (`AWAITING_INCOMING_CONNECTION...`) renders
- This section absorbs the former Challenges content's slot in nav/scroll-order/full-height treatment (`00_INIT`/`01_ABOUT`/`02_SYSTEMS`/`03_CONNECT`) — the actual challenges/stats content (LeetCode, OSS contributions, etc.) is deferred; may be folded into the Featured Systems section in a future feature, not this one
- The former Footer content (brand + year, `GITHUB`/`LINKEDIN`/`EMAIL` links — see AC-7) renders within this same section, below the bordered CTA card — but unlike the CTA card, this footer row spans the FULL viewport width (edge-to-edge, matching the header's full-bleed treatment, own side padding, not clamped to the CTA card's bordered box width) and is NOT fixed/sticky (scrolls normally with the page, unlike the header)

### AC-6 — REMOVED (merged into AC-5)

The standalone full-bleed lime CTA band is removed — its content (headline, email CTA, status microcopy) now lives in AC-5's bordered Connect section instead, avoiding two back-to-back contact CTAs on the same page. `CtaBand.tsx` and its `.cta-band` styles are deleted, not just hidden.

### AC-7 — REMOVED (merged into AC-5)

The standalone Footer section is removed — its brand + year and `GITHUB`/`LINKEDIN`/`EMAIL` links now render inside AC-5's Connect section instead (see AC-5), so they're reachable without scrolling past the site's last nav destination. Unlike AC-6, not all of Footer's content carries forward: the tagline (`BUILT WITH KINETIC_LOGIC v1.0.4`) is dropped entirely, not relocated. `Footer.tsx` is deleted, not just hidden.

### AC-8 — Responsive fidelity

**Given** a visitor loads `/` on desktop, tablet, or mobile
**When** the viewport width changes
**Then:**
- Layout adapts using the Layout/Grid primitive breakpoints from `DESIGN.md` (12-col/24px desktop, 8-col/16px tablet, 4-col/16px mobile)
- Tablet and mobile layouts follow the structure shown in `docs/mockups/web/tablet.png` and `docs/mockups/web/mobile.png` respectively — these mockups define LAYOUT/structure only (stacking order, single-vs-multi-column, nav collapse) for their breakpoint; all page COPY and content stays exactly as already built (per `docs/mockups/web/full.png` / the current build — project names, stats, CTA text, nav labels are NOT replaced with any different wording that appears in the tablet/mobile mockups)
- No section breaks or overlaps at any breakpoint; visual intent from the mockup is preserved

### AC-9 — Accessibility baseline

**Given** any visitor, including keyboard/screen-reader users
**When** they navigate `/`
**Then:**
- Semantic landmarks are used (`header`, `nav`, `main`, `footer`)
- Every interactive element (links, buttons) exposes a visible `:focus-visible` state
- No custom JS focus-trap/keydown handling is introduced (per `03-design-system` a11y pattern — native elements suffice)
- Storybook `@storybook/addon-a11y` axe checks pass for any new component stories

### AC-10 — Icon/Favicon

**Given** the site is loaded in a browser or installed as a PWA
**When** the page `<head>` and manifest are read
**Then:**
- Header logo mark uses the icon from `docs/mockups/icon/web/` (replacing any placeholder mark)
- `favicon.ico` and `apple-touch-icon.png` are wired via `<link>` tags per `docs/mockups/icon/web/README.txt`
- `icon-192.png`, `icon-512.png`, and their maskable variants are wired into the web app manifest per the same README

### AC-11 — Language selector

**Given** a visitor loads `/`
**When** the header renders
**Then:**
- A language selector renders in the header next to `CONNECT.EXE`, styled as a bordered toggle (globe icon + `EN` / `ES` labels, active language highlighted in lime) — not a native `<select>` dropdown
- The selector is a reusable `packages/ui` primitive with a Storybook story (catalog entry, like `Button`/`Card`/`Chip`/`Nav`), not a one-off `apps/web` component — this is the first cross-cutting control this feature contributes back to the design system
- On first visit, the selector pre-selects the browser-detected language (`en`/`es`), matching the existing i18next `browser-languagedetector` behavior (`03-design-system` AC-10)
- Selecting a language switches all page copy (header, hero, builder, featured systems, connect, footer) live via the existing i18next pipeline
- The selection persists across visits (localStorage), per `03-design-system` AC-10

### AC-12 — Visual rhythm & background pattern

**Given** a visitor loads `/`
**When** any section renders
**Then:**
- Consistent vertical spacing separates every section — no section visually reads as cramped/coupled to its neighbor
- Spacing between elements within a section (e.g. hero status chip → headline → subcopy → CTAs) visually matches the proportions shown in `docs/mockups/web/me.png`, not just an arbitrary increased padding value
- A dot-grid background pattern (per the mockup reference) renders behind the page content, generated as a reusable CSS/SVG asset — not a static raster image

### AC-13 — Full-height section navigation

**Given** a visitor loads `/`
**When** they use the header nav or scroll manually
**Then:**
- On desktop (≥1024px), the Hero (`00_INIT`), Builder (`01_ABOUT`), Featured Systems (`02_SYSTEMS`), and Connect (`03_CONNECT`) sections each render at EXACTLY the viewport height (100vh, minus the fixed header height) — never taller, never shorter — landing on any of them via nav shows that section filling the screen edge-to-edge, like a distinct, self-contained "page"
- Each section's content fits entirely within that fixed height with no internal scrolling and no visual overflow/clipping into the next section — content that would otherwise be taller (e.g. Builder's image + text, Featured Systems' project cards) is laid out to fill the available height exactly (e.g. images fill their box via `object-fit: cover` regardless of their own intrinsic size, card rows stretch to divide the remaining height evenly) rather than dictating a taller section
- On desktop, scrolling snaps to these 4 sections' boundaries (CSS scroll-snap, not custom JS pagination) — manual scrolling still works, but naturally comes to rest aligned to one of these sections rather than stopping mid-section
- Below desktop (tablet/mobile), these 4 sections use their natural content height instead — no forced 100vh, no scroll-snap (avoids the well-known mobile `100vh`-vs-address-bar viewport-jump problem, and matches `docs/mockups/web/tablet.png`/`mobile.png`, which show normally-scrolling stacked content, not full-height panels)
- Connect is the last section on the page (former Footer content now renders inside it, per AC-5/AC-7) — there is no separate, shorter section after it that would need excluding from the full-height treatment

## Scope

**In scope:**
- Building `/` route UI (all sections above) matching `docs/mockups/web/me.png`
- Wiring favicon/icons from `docs/mockups/icon/web/`
- SEO meta tags for `/` (title, description, Open Graph)
- Image optimization for section assets (the_builder.webp already optimized; other imagery per Edge cases below)
- Consuming existing `packages/ui` primitives (Button, Card, Chip, Typography, Layout/Grid, Nav, Input)
- One new `packages/ui` primitive: `LanguageToggle` (AC-11) — the language selector, since it's a reusable design-system control, not a one-off page section (reverses this feature's original "no new primitive components" scope line, scoped narrowly to this one control)
- Fixed/sticky header with smooth-scroll in-page navigation (AC-1)
- Full English + Spanish translation of all `/` page copy, wired through the existing i18next pipeline, with a header language selector (AC-11) — reverses this feature's original hardcoded-copy decision (DD-4 in `technical-spec.md`, to be revised)
- Data-driven Featured Systems projects (AC-4) — local data source (array/object), weight-based card sizing, admin-ready shape (no actual admin UI/backend built now)
- Visual polish pass (AC-1, AC-3, AC-5, AC-12): full-bleed centered nav (no CONNECT.EXE CTA), bordered section framing (Builder image, Connect section), mockup-matched section spacing, dot-grid background pattern
- Full-height, scroll-snapped section navigation for Builder/Featured Systems/Connect, desktop only (AC-13)
- Mobile-first responsive rebuild per new `docs/mockups/web/tablet.png`/`mobile.png` layout references — structure/breakpoints only, existing copy/content unchanged (AC-8)
- Remove unused dependencies from `apps/web/package.json`: `tailwindcss`, `zod`, `zustand` — confirmed zero source references; all styling is already plain CSS + design tokens, no forms/client-state exist yet (deferred to Phase 2). Re-add if/when Phase 2 actually needs them.

**Out of scope:**
- Contact form / form UX — deferred to Phase 2
- Blog (Phase 2, per `PRODUCT.md`)
- Content for `00_INIT`, `01_ABOUT`, `02_SYSTEMS`, `03_CONNECT` as separate routes — this feature covers the `/` landing route only
- Real admin/CMS for managing projects — no backend exists in Phase 1 (`PRODUCT.md`: web-only); this feature only shapes the local project data source so a future admin can produce the same shape

## Dependencies

`03-design-system` (tokens + primitives, already `[✓]`).

`docs/mockups/web/full.png` (was `me.png`, desktop reference — content source of truth), `docs/mockups/web/tablet.png` (tablet layout reference), `docs/mockups/web/mobile.png` (mobile layout reference, layout only — supersedes the earlier "no tablet mockup reference" assumption).

## Edge cases

- Featured Systems card imagery: the real repos (`superclean`, `r-backend-task-tracker-cli`, `j-utils`, `wrapper-path`) have no screenshot assets of their own — keep placeholder imagery matching the mockup's visual style until real project screenshots are supplied; swap is a mechanical follow-up, not blocking this feature.
- Two projects with equal `weight` land in the same size tier (see AC-4) — no additional tie-break field needed; stable sort by original data-source order still applies within a tier.
- Narrow viewports (< 4-col mobile breakpoint): text must not overflow/clip — Typography primitives already handle this per `03-design-system`.
- Spanish copy tends to run longer than English for the same meaning — layout must not overflow/clip when the selector switches to `es`, at any breakpoint.
- Fixed header height must be reserved (e.g. body padding-top or `scroll-margin-top` on sections) so page content and anchor-scroll targets don't render underneath it.
- Full-height sections (AC-13) must account for the fixed header's height so 100vh doesn't overflow the viewport by the header's height — same `scroll-margin-top`/height-reservation concern as the existing fixed-header edge case, applied to the section's fixed height instead of just scroll offset.
- Full-height sections (AC-13, revised) now use a hard `height` cap, not `min-height` — content must be laid out to fill that fixed height (flexible images, stretched card grids), not allowed to grow the section taller. On an unusually short viewport where content genuinely cannot fit even after this, an internal scroll within that one section (not a taller section) is an acceptable last-resort fallback — never let the section itself grow past the viewport or silently clip content with no way to reach it.
- Removing `tailwindcss`/`zod`/`zustand`: verify `pnpm --filter @me/web build`/`type-check`/`lint` still pass after removal (confirm nothing was silently depending on them, e.g. a stray `@tailwind` directive or PostCSS config) before considering the removal complete.
- Scroll-based active-section tracking (for the underline) reverses an earlier technical decision that explicitly declined scroll-spy since nothing asked for it — now something does; the reversal should be documented, not silently introduced.

## Risks

- Introducing section images (builder photo, project screenshots) risks Core Web Vitals regression (LCP/CLS) — mitigate with explicit `width`/`height` (or `aspect-ratio`), `loading="lazy"` below the fold, and `fetchpriority="high"` only for the hero-adjacent builder image if it's LCP-critical. Verify via `pnpm --filter @me/web build` bundle/asset size before vs. after, per `j-flow-reviewer` memory pattern.
- Full bilingual coverage (AC-11) means every section's copy must round-trip through translation keys accurately — mistranslation or missed keys (falling back to English mid-page) is a real risk; review both locales manually before approval.
- The dot-grid background pattern (AC-12) must be CSS/SVG-generated, not a raster image — a tiled raster background risks the same CWV regression called out above; verify bundle/asset size before vs. after per the existing `pnpm --filter @me/web build` check.
- CSS scroll-snap (AC-13) can feel disorienting or trap scroll if `mandatory` snapping is too aggressive — verify manually that a visitor can still scroll past/through the 3 full-height sections without feeling stuck, and that it doesn't fight with the existing smooth hash-scroll (AC-1).

## Functional scenarios (optional)

_(none — single-page render, no multi-step flow)_
