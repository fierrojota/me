# Functional Spec — Design System
Date: 2026-07-24

## Purpose

Build the design system foundation (`packages/ui`) for jotafierro.me: tokens, primitives, and Storybook coverage, following the Kinetic Logic / Lime brutalist visual language established in `DESIGN.md` and `docs/mockups/web/me.png`. This is the reusable base every later page (landing, blog) draws primitives from — it does not ship any page content itself.

## Feature users

- Solo dev (Jonathan) — the only consumer/builder of these primitives.

## Trigger

Dev builds a new page (e.g. `06-landing-page`) and pulls primitives from `packages/ui` instead of writing one-off markup/styles.

## Acceptance criteria

### AC-1 — Design tokens

**Given** `packages/ui`
**When** tokens are defined
**Then:**
- Colors, typography, spacing, and shape values from `DESIGN.md` exist as CSS custom properties under `data-theme="dark"`
- Tokens are consumable by `apps/web` via `workspace:*`
- No hex values are hardcoded outside the token definition file itself

### AC-2 — Button primitive

**Given** a page needs a CTA
**When** the `Button` component is used
**Then:**
- Primary variant renders lime (`primary-container`) background, dark text, sharp corners, JetBrains Mono bold/uppercase — matches mockup CTA
- Secondary variant renders transparent background, 1px lime border, lime text
- Both variants expose a visible focus ring and are reachable/operable via keyboard (Tab + Enter/Space)

### AC-3 — Chip/Tag primitive

**Given** status or label text (e.g. `[ STATUS: ... ]`, `DEBUG_MODE TRUE`)
**When** the `Chip` component is used
**Then:**
- Renders bordered, JetBrains Mono text
- Supports neutral, success (lime), and error (red) variants

### AC-4 — Card primitive

**Given** content needing a bordered container (e.g. featured systems, about card)
**When** the `Card` component is used
**Then:**
- Sharp corners, `surface-container` background, 1px `secondary-container` border, no shadow
- Optional header slot renders with a bottom border separating it from body content

### AC-5 — Typography primitives

**Given** headline, body, or label text
**When** the corresponding typography component/utility class is used
**Then:**
- Output matches `DESIGN.md` type scale exactly (Geist for headline/body, JetBrains Mono for labels; correct size/weight/line-height/letter-spacing per token)

### AC-6 — Storybook coverage

**Given** each primitive built in this feature
**When** viewed in Storybook
**Then:**
- A story exists per primitive showing all variants and interactive states (default, hover, focus, disabled where applicable)

### AC-7 — Layout/Grid primitive

**Given** a page section is being built
**When** the layout primitive/util is used
**Then:**
- Responsive grid is available: 12-column desktop (24px gutter), 8-column tablet (16px gutter), 4-column mobile (16px gutter)
- `container-max` (1280px) constraint is available as a utility

### AC-8 — Input field primitive

**Given** a form needs a text input (e.g. future contact/blog use)
**When** the `Input` component is used
**Then:**
- Background `surface-container`, 1px `secondary-container` border
- On focus, border shifts to `primary-container` with 1px inner stroke
- Exposes a visible focus state reachable via keyboard

### AC-9 — Nav primitive

**Given** a page needs header navigation
**When** the `Nav` component is used
**Then:**
- Renders text links matching mockup header (logo/brand slot + link list + optional CTA slot)
- Active link state renders in lime (`primary-container`)
- Links are keyboard-navigable (Tab order, visible focus)

### AC-10 — i18n foundation

**Given** the app needs to support English and Spanish content
**When** i18n is wired into `apps/web`
**Then:**
- `i18next` + `react-i18next` (+ `i18next-browser-languagedetector`) are installed and initialized
- English (`en`) is the canonical/primary content language (authored first); Spanish (`es`) is the second/translated language; missing keys fall back to English (`fallbackLng: 'en'`)
- On first visit, locale auto-selects based on the browser's language (`navigator`) — Spanish-language browsers get `es`, everything else falls back to `en`
- Translation files follow the `aura` convention: `public/locales/{lng}/{namespace}.json`, namespaced per feature area, `common` as default namespace
- At least one namespace (`common`) exists with matching keys in both `en` and `es` as a working example
- Locale preference persists (localStorage) once the user has one detected/selected

## Scope

**In scope:**
- Design tokens (color, typography, spacing, shape) in `packages/ui`
- Primitives: Button, Chip/Tag, Card, Typography, Layout/Grid, Input, Nav
- Storybook stories for every primitive above
- i18n foundation (lib setup, locale files, `common` namespace) in `apps/web`
- Accessibility: focus states + keyboard operability on all interactive primitives

**Out of scope:**
- Blog-specific components (deferred to `07-blog`)
- Actual landing page content/copy (`06-landing-page`, depends on this feature)
- Light mode (single dark theme per `DESIGN.md`)
- Auth-related UI (no auth in v1)
- Data visualization components beyond token color usage (no chart lib chosen yet)
- Full site content translation (only `common` namespace scaffolded here; per-page namespaces added as those pages are built)

## Dependencies

- `01-infra-base` (monorepo, `packages/ui`, Storybook already scaffolded)
- Blocks `06-landing-page` (depends on this feature for primitives)

## Edge cases

- Primitive used with no i18n key present for a locale → falls back to `en`, never renders a raw key string
- Focus states must remain visible against both `surface-container` and `background` (contrast check)
- Chip/Tag text longer than container → no truncation strategy assumed yet; primitive must not break layout (wraps or scrolls, not overflow-hidden silently)

## Risks

- New i18n deps (`i18next`, `react-i18next`, `i18next-browser-languagedetector`) add bundle weight — CONSTITUTION P1 is a blocking gate; measure `pnpm --filter @me/web build` before/after per prior `02-observability` review finding, code-split/lazy-load if regression appears
- Token/primitive scope creep — new components invented ahead of actual page need must be resisted (YAGNI); only primitives with a concrete consumer in the mockup or Phase 1 backlog are built here

## Functional scenarios (optional)

N/A — primitives are independent, no multi-step user journey to document.
