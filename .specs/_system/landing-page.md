# System spec — landing-page

> Source of truth for the current behavior of this domain.
> Auto-updated by `/j-flow-finish`. Do not edit manually outside of a finish run.
> Last updated: 2026-10-09 by feature `07-brand-alignment`

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
- Nav links render horizontally centered on that full header width (between the brand mark and the right edge; the language toggle was removed in 07-brand-alignment), independent of viewport size
- Below the tablet breakpoint, the nav links collapse behind a hamburger/menu toggle — same nav content (`01_ABOUT`/`02_SYSTEMS`/`03_CONNECT`, language toggle), just collapsed; toggle is keyboard-operable, no custom JS focus-trap (native disclosure pattern)
- In the collapsed mobile menu, the active-section link still shows the lime color + underline state (no slide animation there)

### AC-2 — Hero

**Given** a visitor loads `/`
**When** the hero section renders
**Then:**
- Status chip renders (Spanish copy since 07-brand-alignment): `[ STATUS: HIGH_PERFORMANCE_LOGIC ]` → `[ ESTADO: LOGICA_DE_ALTO_RENDIMIENTO ]`
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
- Headline renders, centered (`HABLEMOS` since 07-brand-alignment; was `BUILD_REMARKABLE_SYSTEMS_NOW`)
- A subtitle renders between the headline and the email CTA
- Email CTA button (`CONNECT@JOTAFIERRO.ME`) renders, centered
- Status microcopy (`AWAITING_INCOMING_CONNECTION...`) renders
- Footer content (brand + year, `GITHUB`/`LINKEDIN`/`YOUTUBE`/`EMAIL` links; YOUTUBE added in 07-brand-alignment) renders within this same section, below the bordered CTA card — spans the FULL viewport width (edge-to-edge, matching the header's full-bleed treatment) and is NOT fixed/sticky

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

### AC-11 — Language selector _(superseded by 07-brand-alignment AC-1/AC-2: the selector is hidden and the site is Spanish-only)_

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

### 07-brand-alignment — Brand alignment: Spanish-only site, positioning copy, YouTube link (2026-10-09)

### AC-1 — Spanish is the only language

**Given** any visitor, whatever their browser language or a previously stored language
**When** `/` loads
**Then:**
- All copy renders in Spanish
- `<html lang>` is `es`
- A stored `en` value in localStorage does not switch the page to English
- The English locale files and the bilingual i18n infrastructure remain in the repo, unused by the UI

### AC-2 — Language toggle hidden

**Given** a visitor on any viewport
**When** the header renders (desktop bar or collapsed mobile menu)
**Then:**
- No language selector is rendered or focusable
- The `LanguageToggle` primitive and its Storybook story remain in `packages/ui`
- Nav links keep their layout (centered, active underline) without the toggle's slot looking empty

### AC-3 — Hero states the positioning

**Given** a visitor loads `/`
**When** the Hero renders
**Then:**
- Headline and subcopy express: "El ingeniero que le pone proceso a todo — al código y a la vida", keeping the existing prefix/highlight/suffix headline structure (highlight in lime with underline)
- The STATUS chip and both CTAs keep their current terminal-style wording and behavior
- No claim of availability for hire or services

### AC-4 — Builder bio reflects the published bio

**Given** a visitor scrolls to the Builder section
**When** the section renders
**Then:**
- The bio conveys: senior backend, husband, two daughters, basketball, all built between 5:30 and 9:30 AM
- The 3 pillars (Ingeniería y carrera · Vida en construcción · Biblioteca) are visible as copy inside the Builder section
- No daughters' names, ages or photos; no absolute money figures; no academic-degree claim

### AC-5 — Connect carries no service offer

**Given** a visitor scrolls to Connect
**When** the section renders
**Then:**
- The headline reads `HABLEMOS` (replacing the pitch-style `CONSTRUYE_SISTEMAS_NOTABLES_AHORA`)
- The subtitle no longer says the author accepts engineering partnerships/collaborations, and no quarter/availability text remains
- The email CTA (mailto) stays as a plain contact point
- The `nextQuarter()` usage is removed from the component if no longer needed

### AC-6 — YouTube channel link

**Given** a visitor on `/`
**When** the Connect footer renders
**Then:**
- A link to https://www.youtube.com/@fierrojota renders in the footer, opens in a new tab with `rel="noopener noreferrer"`, with an accessible name that includes its visible text (label-in-name)
- Footer lists GITHUB / LINKEDIN / YOUTUBE / EMAIL
- No separate button is added next to the email CTA

### AC-7 — Metadata and machine-readable files match

**Given** a crawler or LLM reads the site
**When** it fetches `index.html`, `llms.txt`
**Then:**
- `<html lang="es">`, title/description and `llms.txt` use the new positioning in Spanish and list the YouTube channel
- Nothing mentions services, newsletter or support links

### AC-8 — Quality gates unchanged

**Given** the change is built
**When** lint, type-check, unit tests, Playwright e2e and a11y checks run
**Then:**
- All pass; tests that assumed EN/ES switching are updated or removed accordingly; no new hardcoded strings outside i18n

<!-- next feature entries are appended above this line -->
