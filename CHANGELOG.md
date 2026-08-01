# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-07-29

### Added
- [04-design-polish] `/` landing route: Hero, Builder/About, Featured Systems, Connect sections matching the approved visual design
- [04-design-polish] Full English/Spanish translation of all `/` page copy, with a header `LanguageToggle` primitive (new `packages/ui` component)
- [04-design-polish] Data-driven Featured Systems: real public GitHub repos, card size computed by a recursive treemap proportional to each project's weight (recomputes automatically for any project count), whole-card click-through to each project's link
- [04-design-polish] Data-driven Builder/About content (`data/builder.ts`), including a real outbound link to the author's current employer
- [04-design-polish] Scroll-tracked, animated nav underline indicator; desktop-only full-height/scroll-snapped sections (Hero/Builder/Featured Systems/Connect each fill the viewport like an independent page)
- [04-design-polish] Mobile hamburger nav disclosure (native `<details>`/`<summary>`, zero JS)
- [04-design-polish] Favicon/manifest/SEO meta tags for `/`
- [04-design-polish] CSS dot-grid background pattern
- [04-design-polish] `apps/e2e/tests/home.spec.ts` E2E coverage; `nav-underline.spec.ts` regression test for a scroll-tracking bug found during the build

### Fixed
- [04-design-polish] Nav underline getting stuck on a stale section after a fast nav-link click (root cause: `IntersectionObserver` silently dropping callbacks under main-thread contention — replaced with a scroll/rAF-based mechanism)

### Changed
- [04-design-polish] Removed unused dependencies from `apps/web`: `tailwindcss`, `zod`, `zustand`
- [04-design-polish] `CONSTITUTION.md`: added P5 ("full-height, page-like sections"), promoting this feature's section-navigation pattern to a durable project-wide principle

## [0.3.0] - 2026-07-24

### Added
- [03-design-system] Design tokens (`packages/ui/src/tokens.css`) — colors, typography, spacing, shape as CSS custom properties, 1:1 with `DESIGN.md`
- [03-design-system] Primitives: Button, Chip, Card, Input, Nav — full Storybook + Vitest + a11y coverage
- [03-design-system] CSS-only Typography and Layout/Grid utilities
- [03-design-system] i18n foundation (`i18next`) in `apps/web` — English primary, Spanish second, browser-language auto-detection
- [03-design-system] `@storybook/addon-vitest` (every story runs as a real Chromium test), `@storybook/addon-docs` (autodocs), `@storybook/addon-a11y` (axe checks per story)

### Changed
- [03-design-system] Vitest bumped `^2.1.0` → `^3.0.0` repo-wide (`apps/web`, `packages/ui`) to support `@storybook/addon-vitest`
- [03-design-system] `apps/web/src/index.css` repointed at canonical design tokens, duplicate hardcoded hex values removed

## [0.2.0] - 2026-07-24

### Added
- [02-observability] Sentry (`@sentry/react`) error tracking, performance tracing, and session replay for `apps/web`, reporting to a GlitchTip cloud project
- [02-observability] Dependency-free `ErrorBoundary` with fallback UI, code-split Sentry loading (deferred via idle callback) to avoid regressing the initial bundle
- [02-observability] `docs/OBSERVABILITY.md` setup guide, `apps/web/.env.example` with `VITE_SENTRY_*` vars

## [0.1.0] - 2026-07-22

### Added
- [01-infra-base] Scaffolded monorepo with apps/{web, e2e} and packages/{ui, domain, config}
- [01-infra-base] GitHub Actions CI pipeline
- [01-infra-base] Storybook catalog with Welcome component (DESIGN.md tokens)
- [01-infra-base] Root README.md with local development instructions
- [01-infra-base] Default theme detection from DESIGN.md
- [01-infra-base] Centered welcome screens for web and storybook (DESIGN.md tokens)
- [01-infra-base] Smoke tests (vitest) for web
- [01-infra-base] Playwright browser auto-install on scaffold
- [01-infra-base] CLAUDE.md with stack overview, commands, and conventions for Claude Code sessions
- [01-infra-base] docs/STORYBOOK.md and docs/PLAYWRIGHT.md
