# Design polish (landing route `/`)

**Slug:** 04-design-polish
**Branch:** feature/04-design-polish
**PR:** (created below)
**Merged:** 2026-07-29

## Summary

Built the site's `/` landing route to match the approved visual design — fixed/full-bleed header with a scroll-tracked animated nav underline, Hero, Builder/About (data-driven, with a real outbound company link), Featured Systems (real public GitHub repos, sized via a recursive treemap so the grid recomputes automatically for any project count), and a merged Connect+Footer section. Full English/Spanish bilingual coverage, mobile-first responsive rebuild, and desktop-only full-height/scroll-snapped sections that give each section the feel of an independent page — a pattern promoted to `CONSTITUTION.md` (P5) during this feature.

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Fixed/full-bleed header, centered nav, scroll-tracked animated underline, mobile hamburger disclosure | ✓ |
| AC-2 | Hero: status chip, headline, subcopy, 2 CTAs | ✓ |
| AC-3 | Builder/About: bordered image+text frame, data-driven facts/stats, Fz Sports company link | ✓ |
| AC-4 | Featured Systems: real GitHub repos, treemap-based weight-proportional sizing, clickable cards | ✓ |
| AC-5 | Connect: bordered CTA card + subtitle, full-bleed bottom-pinned footer (merged former Footer content) | ✓ |
| AC-6 | REMOVED — merged into AC-5 | — |
| AC-7 | REMOVED — merged into AC-5 | — |
| AC-8 | Responsive fidelity across desktop/tablet/mobile | ✓ |
| AC-9 | Accessibility baseline (semantic landmarks, focus-visible, axe checks) | ✓ |
| AC-10 | Favicon/icon/manifest wiring | ✓ |
| AC-11 | Bilingual (en/es) LanguageToggle primitive, persisted | ✓ |
| AC-12 | Visual rhythm + CSS dot-grid background | ✓ |
| AC-13 | Full-height, scroll-snapped sections (desktop only) | ✓ |

## Files Added / Modified

| File | Change |
|------|--------|
| `apps/web/src/pages/HomePage.tsx`, `home.css` | Route composition, all section CSS |
| `apps/web/src/components/home/{Header,Hero,Builder,FeaturedSystems,Connect,Section,ProjectCard}.tsx` | Section components |
| `apps/web/src/data/{builder,projects}.ts` | Local typed data modules (i18n key-path pattern) |
| `apps/web/src/lib/treemap.ts` | Recursive weight-proportional layout algorithm |
| `apps/web/src/hooks/useActiveSection.ts` | Scroll/rAF-based active-section tracking |
| `packages/ui/src/components/{Nav,LanguageToggle}.tsx` + CSS | Centered nav w/ mobile disclosure + underline indicator; new LanguageToggle primitive |
| `apps/web/public/locales/{en,es}/home.json` | Full bilingual copy |
| `apps/web/src/index.html`, `public/{favicon.ico,manifest.json,...}` | Icons/SEO |
| `apps/e2e/tests/{home,nav-underline,health}.spec.ts` | E2E coverage |
| `CONSTITUTION.md` | New P5 principle (full-height, page-like sections) |

## Patterns Introduced

- **Recursive treemap layout** (`lib/treemap.ts`): a ~40-line slice-and-dice algorithm that lays out N weighted items proportional to their weight share, with a proof-by-construction area guarantee (no gaps, for any N). Rendered via CSS custom properties + `position: absolute`, active only at the desktop breakpoint. Reuse this pattern for any future weight/priority-driven grid.
- **Local typed data modules with i18n key-path fields** (`data/projects.ts`, `data/builder.ts`): content lives in `home.json`, the data module owns shape/structure only — future admin/CMS work can produce the same shape without a component rewrite.
- **Scroll/rAF active-section tracking**, not `IntersectionObserver` — the latter silently stopped delivering callbacks under main-thread contention (root-caused via CDP CPU throttling). `useActiveSection` polls `getBoundingClientRect()` on scroll/resize, rAF-throttled.
- **Native `<details>`/`<summary>` mobile nav disclosure** — zero-JS hamburger menu, `display: contents` + `::details-content` unwrap keeps desktop centering untouched.
- **CONSTITUTION P5** — full-height, page-like sections is now a durable, project-wide principle, not a one-feature choice.

## Test Coverage

- Unit: `pnpm --filter @me/web test`, `pnpm --filter @me/ui test`
- E2E (Playwright): `pnpm --filter @me/e2e test` (`home.spec.ts`, `nav-underline.spec.ts`, `health.spec.ts`)
- Visual: `pnpm --filter @me/ui storybook`
