# Architecture — Design polish (landing route `/`)

Date: 2026-07-29
Slug: 04-design-polish

## Architecture Overview

Pure UI composition on top of the primitives delivered in `03-design-system` (`packages/ui`: `Button`, `Card`, `Chip`, `Input`, `Nav`, `LanguageToggle`, plus `tokens.css`/`typography.css`/`layout.css`) — no new backend, no new route beyond `/`, no new runtime dependency across 12 spec revisions.

```
apps/web/src/pages/HomePage.tsx
  useLocation().hash → useEffect → element.scrollIntoView()   — hash-scroll trigger

  1. <Header>
       Fixed/sticky, full-bleed (no container-max clamp), centered nav
       (3-col grid: brand / centered links / cta)
       useActiveSection() (scroll + rAF + getBoundingClientRect, NOT
         IntersectionObserver — see Design Decisions) feeds Nav's
         `activeTo` prop → scroll-tracked animated underline indicator
       Native <details>/<summary> hamburger disclosure <768px (zero JS)
       Brand wrapped in <a href="#init"> — click scrolls to Hero
  2. <main>
       <Hero id="init">                     status chip, headline, subcopy, 2 CTAs
       <Builder id="the-builder">           bordered image+text frame; content
                                             sourced from data/builder.ts (i18n
                                             key-path shape, mirrors projects.ts);
                                             CURRENT_ROLE's company name is a real
                                             <a target="_blank" rel="noopener
                                             noreferrer"> to fzsports.com
       <FeaturedSystems id="featured-systems">
                                             projects render from data/projects.ts
                                             (real public GitHub repos); card size
                                             computed by a recursive treemap
                                             (lib/treemap.ts) proportional to each
                                             project's `weight` — works for any N,
                                             not a fixed tier system; rendered via
                                             CSS custom properties + position:
                                             absolute, desktop-only; each card is
                                             a whole-card <a> to its own url
       <Connect id="connect">               hand-rolled <section> (bypasses the
                                             shared Section wrapper) so its merged
                                             former-Footer content can render
                                             full-bleed, bottom-pinned, while the
                                             CTA card above it stays width-capped
                                             and vertically centered
     </main>
```

Desktop-only (≥1024px): Hero/Builder/FeaturedSystems/Connect are hard-capped at exactly `100vh − header height` and CSS scroll-snapped — each section fills the screen like an independent page. Below 1024px, all 4 render at natural content height with no snapping (avoids the mobile `100vh`-vs-address-bar problem).

## Design Decisions

- **Data-driven content, not hardcoded JSX.** Both `data/projects.ts` (Featured Systems) and `data/builder.ts` (Builder's role/specialization/philosophy/quote/stats) hold i18n *key-path* strings, not resolved copy — the actual English/Spanish prose stays in `home.json` via the existing i18next pipeline. This lets a future backend/admin manage the same shape without any component rewrite.

- **Recursive treemap for weight-proportional card sizing** (`apps/web/src/lib/treemap.ts`). An earlier design used a fixed 3-tier CSS-class system (large/medium/small by weight threshold) with `grid-auto-flow: dense` packing, hand-verified only for the current 4-project dataset — rejected because it wouldn't recompute correctly for a re-curated list of a different size. The treemap instead recursively bisects the (weight-sorted) item list, alternating split axis each level, so every leaf's final area telescopes out to exactly `total area × (its weight / sum of all weights)` — true by construction, for any N ≥ 1, with zero hardcoded thresholds. Rendered via CSS custom properties (`--rect-top/left/width/height`) consumed only inside the `≥1024px` media query, keeping tablet/mobile's simple uniform grid 100% CSS-driven with no JS breakpoint detection.

- **Scroll/rAF-based active-section tracking, not `IntersectionObserver`.** The nav's scroll-tracked underline indicator originally used `IntersectionObserver`, which was found (via CDP CPU throttling — 100% repro at 6x, 0% at native speed) to silently stop delivering callbacks under main-thread contention, leaving the underline stuck on a stale section after a fast nav click. Replaced with a `scroll`/`resize`-driven, `requestAnimationFrame`-throttled `getBoundingClientRect()` computation (`useActiveSection`). Regression-tested in `apps/e2e/tests/nav-underline.spec.ts`.

- **Native `<details>`/`<summary>` for the mobile hamburger nav**, not a JS-driven disclosure — zero additional JS, `display: contents` (plus explicit `::details-content` targeting, a Chromium implementation detail) unwraps the disclosure's internal box so existing desktop centering CSS is untouched at ≥768px.

- **Connect hand-rolls its own `<section>`**, the one exception to the shared `Section` wrapper component used by every other section. Necessary because Connect's merged former-Footer content must render full-bleed (a sibling of `.container-max`, not nested inside it) while the CTA card above it stays width-capped — `Section`'s API has no escape hatch for this, and adding one for a single caller was assessed as unwarranted API growth for the other 3 consumers.

- **Whole-card click-to-new-tab on Featured Systems**, implemented by retagging the already-positioned `.project-card-cell` wrapper from `<div>` to `<a>` rather than adding a new prop to `ProjectCard` — that wrapper is already the CSS-custom-property-driven positioned element, so no new sizing CSS was needed.

- **CONSTITUTION.md gained a new principle, P5 ("full-height, page-like sections")** — promoting the desktop full-height/scroll-snap section pattern from a one-feature choice to a durable, project-wide structural rule enforced by future `/j-flow-review` passes.

Full revision-by-revision decision history (DD-1 through DD-48) lives in `.specs/04-design-polish/technical-spec.md` and `.specs/04-design-polish/gate-context.md`.
