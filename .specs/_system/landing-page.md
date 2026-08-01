# System spec — landing-page

> Source of truth for the current behavior of this domain.
> Auto-updated by `/j-flow-finish`. Do not edit manually outside of a finish run.
> Last updated: 2026-07-29 by feature `04-design-polish`

## Behaviors

### 04-design-polish — Design polish (landing route `/`) (2026-07-29)

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
- Below the tablet breakpoint, the nav links collapse behind a hamburger/menu toggle — same nav content (`01_ABOUT`/`02_SYSTEMS`/`03_CONNECT`, language toggle), just collapsed; toggle is keyboard-operable, no custom JS focus-trap (native disclosure pattern)
- In the collapsed mobile menu, the active-section link still shows the lime color + underline state (no slide animation there)

### AC-2 — Hero

**Given** a visitor loads `/`
**When** the hero section renders
**Then:**
- Status chip renders: `[ STATUS: HIGH_PERFORMANCE_LOGIC ]`
- Headline renders with the "HIGH PERFORMANCE." phrase in lime with underline, rest in default text color
- Subcopy paragraph renders below headline
- Primary CTA (`INITIALIZE_VIEW_SYSTEMS`) and secondary CTA (`WHO_IS_THE_BUILDER?`) render per Button primitive variants

### AC-3 — About/Builder

**Given** a visitor scrolls to the "THE_BUILDER" section
**When** the section renders
**Then:**
- Builder photo renders as the section image, `object-fit: cover` filling a designated image container
- Role/specialization/philosophy bullet list renders (`CURRENT_ROLE`, `SPECIALIZATION`, `PHILOSOPHY`)
- The `CURRENT_ROLE` fact's company name renders as "Fz Sports" and is a link to `https://www.fzsports.com/` (opens in a new tab, `rel="noopener noreferrer"`)
- Role/specialization/philosophy/quote/stat content is sourced from a local, typed data module (mirrors AC-4's data-driven pattern)
- Pull-quote renders below the list
- Two stat cards render (`01_PRACTICE` / `CLEAN_ARCH`, `02_VELOCITY` / `INNOVATION`) using the Card primitive
- The whole section content (image + text column together) renders inside one bordered frame
- On desktop (≥1024px), the image column and text column match each other's height; the text column's content is vertically centered within that shared height

### AC-4 — Featured Systems

**Given** a visitor scrolls to "FEATURED_SYSTEMS"
**When** the section renders
**Then:**
- Section heading + subcopy render, plus `OPEN_GITHUB [ALL]` link
- Projects render from a data source (array of project objects: `id`, `tag`, `title`, `description`, `imageAlt`, `weight`, `url`, optional `image`) — not hardcoded per-card JSX
- Project list reflects the author's real public repositories at `github.com/jotafierro`
- Each project's card area is exactly proportional to its `weight` relative to the sum of all weights currently in the list — recomputes automatically for any number of projects: equal weight → equal area, a dominant weight → proportionally larger area, always tiling the section's full space with no gaps
- Each card shows a tag chip, title, and description text
- Each project has a `url` field — clicking anywhere on the card navigates to that `url`, opening in a new tab

### AC-5 — Connect

**Given** a visitor scrolls to the `03_CONNECT` section
**When** the section renders
**Then:**
- The section renders as a bordered/framed box (not full-bleed lime background) — dark background, thin border, centered content
- Headline (`BUILD_REMARKABLE_SYSTEMS_NOW`) renders, centered
- A subtitle renders between the headline and the email CTA
- Email CTA button (`CONNECT@JOTAFIERRO.ME`) renders, centered
- Status microcopy (`AWAITING_INCOMING_CONNECTION...`) renders
- Footer content (brand + year, `GITHUB`/`LINKEDIN`/`EMAIL` links) renders within this same section, below the bordered CTA card — spans the FULL viewport width (edge-to-edge, matching the header's full-bleed treatment) and is NOT fixed/sticky

### AC-8 — Responsive fidelity

**Given** a visitor loads `/` on desktop, tablet, or mobile
**When** the viewport width changes
**Then:**
- Layout adapts using the Layout/Grid primitive breakpoints (12-col/24px desktop, 8-col/16px tablet, 4-col/16px mobile)
- No section breaks or overlaps at any breakpoint

### AC-9 — Accessibility baseline

**Given** any visitor, including keyboard/screen-reader users
**When** they navigate `/`
**Then:**
- Semantic landmarks are used (`header`, `nav`, `main`, `footer`)
- Every interactive element exposes a visible `:focus-visible` state
- No custom JS focus-trap/keydown handling is introduced
- Storybook `@storybook/addon-a11y` axe checks pass for any new component stories

### AC-10 — Icon/Favicon

**Given** the site is loaded in a browser or installed as a PWA
**When** the page `<head>` and manifest are read
**Then:**
- Header logo mark uses the branded icon
- `favicon.ico` and `apple-touch-icon.png` are wired via `<link>` tags
- `icon-192.png`, `icon-512.png`, and their maskable variants are wired into the web app manifest

### AC-11 — Language selector

**Given** a visitor loads `/`
**When** the header renders
**Then:**
- A language selector renders in the header, styled as a bordered toggle (globe icon + `EN` / `ES` labels, active language highlighted in lime)
- The selector is a reusable `packages/ui` primitive (`LanguageToggle`) with a Storybook story
- On first visit, the selector pre-selects the browser-detected language
- Selecting a language switches all page copy live via the existing i18next pipeline
- The selection persists across visits (localStorage)

### AC-12 — Visual rhythm & background pattern

**Given** a visitor loads `/`
**When** any section renders
**Then:**
- Consistent vertical spacing separates every section
- A dot-grid background pattern renders behind the page content, generated as a reusable CSS/SVG asset

### AC-13 — Full-height section navigation

**Given** a visitor loads `/`
**When** they use the header nav or scroll manually
**Then:**
- On desktop (≥1024px), the Hero, Builder, Featured Systems, and Connect sections each render at EXACTLY the viewport height (100vh, minus the fixed header height)
- Each section's content fits entirely within that fixed height with no internal scrolling (per-section internal scroll is an acceptable last-resort fallback only)
- On desktop, scrolling snaps to these 4 sections' boundaries (CSS scroll-snap)
- Below desktop (tablet/mobile), these 4 sections use their natural content height instead — no forced 100vh, no scroll-snap
- Connect is the last section on the page — no separate, shorter section after it

<!-- next feature entries are appended above this line -->
