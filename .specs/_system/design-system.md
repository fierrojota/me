# System spec — design-system

> Source of truth for the current behavior of this domain.
> Auto-updated by `/j-flow-finish`. Do not edit manually outside of a finish run.
> Last updated: 2026-07-24 by feature `03-design-system`

## Behaviors

### 03-design-system — Design tokens, primitives, Storybook coverage, and i18n foundation in packages/ui + apps/web (2026-07-24)

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

<!-- next feature entries are appended above this line -->
