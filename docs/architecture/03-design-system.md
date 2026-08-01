# Architecture — Design System

Date: 2026-07-24
Slug: 03-design-system

## Architecture Overview

No backend, no data, no mobile — this feature is pure `packages/ui` + Storybook + one `apps/web` wiring concern (i18n). Two independent flows:

```
DESIGN.md (source of truth)
   │
   ▼
packages/ui/src/tokens.css        CSS custom properties, [data-theme="dark"] (AC-1)
packages/ui/src/typography.css    type-scale utility classes, reads tokens.css vars (AC-5)
packages/ui/src/layout.css        grid + container-max utility classes, reads tokens.css vars (AC-7)
packages/ui/src/components/
   Button.tsx + button.css        (AC-2)
   Chip.tsx   + chip.css          (AC-3)
   Card.tsx   + card.css          (AC-4)
   Input.tsx  + input.css         (AC-8)
   Nav.tsx    + nav.css           (AC-9)
   *.stories.tsx per primitive above, plus story-only demos for
   typography.css / layout.css   (AC-6)
   │
   │  index.ts: side-effect imports (tokens/typography/layout .css) + barrel exports
   ▼
packages/ui  ──  workspace:*  ──▶  apps/web/src/main.tsx  (import '@me/ui' applies tokens document-wide)
                                   apps/web (future pages) import { Button, Chip, Card, Input, Nav } from '@me/ui'
                                   packages/ui/.storybook  (independent catalog, port 6006)

──────────────────────────────────────────────────────────────────────────

i18n (apps/web only, AC-10):

apps/web/src/lib/i18n.ts
   .use(HttpBackend)          fetches /locales/{{lng}}/{{ns}}.json from apps/web/public/locales (static assets, not JS bundle)
   .use(LanguageDetector)     order: [localStorage, navigator], caches: [localStorage] — navigator wins on first visit (nothing cached yet)
   .use(initReactI18next)
   .init({ fallbackLng: 'en', defaultNS: 'common', ns: ['common'] })
   │
   ▼
apps/web/src/main.tsx  ──  import './lib/i18n' (side-effect, runs before render, same pattern as sentry.ts wiring)
   │
   ▼
future consumers call useTranslation('common') against the global i18next instance — no <I18nextProvider> needed (single instance app)
```

## Design decisions

- **DD-1 — Token architecture:** one flat `packages/ui/src/tokens.css` file, custom property names copied 1:1 from `DESIGN.md`'s token table (`--primary-container`, `--on-primary-container`, `--surface-container`, etc.) under `[data-theme="dark"]`, matching `main.tsx`'s existing `document.documentElement.dataset.theme = 'dark'` line (unchanged). Typography sub-values (size/weight/line-height/letter-spacing per scale token) are separate custom properties (e.g. `--headline-lg-font-size`, `--headline-lg-font-weight`) since a CSS custom property can't hold a shorthand consumed across multiple distinct properties. `apps/web/src/index.css`'s existing 3 hardcoded hex vars (`--color-bg`, `--color-fg`, `--color-primary`) are deleted and its `.app-shell`/`.app-title` rules repointed at the new canonical token names — that duplication would otherwise violate AC-1's "no hex values hardcoded outside the token definition file itself" the moment both files exist side by side.

- **DD-2 — Grid breakpoints:** `DESIGN.md` specifies column/gutter counts per tier (12/24px desktop, 8/16px tablet, 4/16px mobile) but no explicit pixel breakpoints. Mobile-first default (4-col) with `@media (min-width: 768px)` → 8-col tablet and `@media (min-width: 1024px)` → 12-col desktop — standard, widely-used breakpoint values, chosen pragmatically rather than blocking the spec on an unspecified detail.

- **DD-3 — Typography & Layout as CSS-only utilities, not React components:** AC-5/AC-7 both say "component/utility class" or "primitive/util" — genuinely ambiguous which form is required. Chose CSS utility classes only (no `<Typography>`/`<Grid>` wrapper components) applied via `className` directly on native semantic elements (`h1`, `p`, `span`, `div`) — this is the native-HTML/CSS-Grid primitive (ladder rung 4) and avoids an unjustified wrapper component with no behavior beyond a class name (code-style rule 3: no abstraction reused in fewer than 3 places — a `<Typography variant="headline-lg">` wrapper around `<h1 className="text-headline-lg">` adds nothing). AC-6's "story exists per primitive" is still satisfied via story-only, non-exported showcase components (`Typography.stories.tsx`, `Grid.stories.tsx`) that render the utility classes for Storybook cataloging — these are not part of `index.ts`'s public export surface, so they don't count as "components" for the reviewer's "Storybook stories exist for every exported component" check, but they do satisfy AC-6's literal requirement that a story exists per primitive.

- **DD-4 — i18next transport: `i18next-http-backend` vs. static JSON imports:** AC-10's own file-path convention (`public/locales/{lng}/{namespace}.json`) is `i18next-http-backend`'s *default* `loadPath` (`/locales/{{lng}}/{{ns}}.json`) — so the `backend` option is omitted entirely from `.init()`, relying on the library default rather than restating it. This is also the leaner bundle-size choice flagged in agent memory: locale JSON ships as static assets fetched over HTTP, never inlined into the JS bundle, vs. static `import` which would bundle every locale's JSON into the initial chunk. Given this is namespace-scoped per feature area (AC-10 scope: only `common` today), http-backend also means future per-page namespaces (`07-blog`, `06-landing-page`) are fetched on demand with zero additional JS-bundle cost, without needing a manual code-split per namespace.

- **DD-4b — Fallback direction:** English (`en`) is authored first and is canonical; `fallbackLng: 'en'` means a key missing from `es/common.json` serves the English string rather than a raw key. This matches `aura`'s own convention (`fallbackLng: 'en'` there too) — no deviation from the established pattern.

- **DD-5 — No `<I18nextProvider>`, no `<Suspense>` wrapper in this feature:** `react-i18next`'s `useTranslation()` reads the global `i18next` singleton once `.use(initReactI18next).init(...)` has run — a `<Provider>` is only needed for multiple simultaneous instances, which this app doesn't have. No component in this feature calls `useTranslation()` (App.tsx is untouched — the functional spec explicitly scopes "actual landing page content/copy" out), so no `<Suspense>` boundary is added yet either. *Skipped: Suspense fallback wrapper, add in `06-landing-page` when the first component calls `useTranslation()`.*

- **DD-6 — Chip variants reconcile AC-3 ("bordered") with `DESIGN.md`'s Chips/Status pattern (filled bg for success/error):** not a contradiction — a chip can be both bordered and filled. `neutral`: transparent bg, `outline`-token border, `on-surface-variant` text. `success`: `primary-container` bg + border, `on-primary-container` text. `error`: `error` bg + border, `on-error` text. All three keep the shared "bordered, JetBrains Mono" trait from AC-3.

- **DD-7 — Plain CSS over Tailwind:** `apps/web` lists `tailwindcss` as a dependency but has no config/PostCSS/`@tailwind` directives wired up, and both existing style files in the repo (`welcome.css`, `apps/web/index.css`) are hand-written plain CSS. This feature continues that pattern for every new token/primitive file rather than introducing Tailwind's utility-class system now — wiring up Tailwind isn't required by any AC here, and doing so alongside untouched plain CSS would leave two competing styling systems half-adopted (P2 simplicity).

- **DD-8 — Focus/keyboard a11y (AC-2, AC-8, AC-9, CONSTITUTION P4):** every interactive primitive is a native element (`<button>`, `NavLink` → `<a>`, `<input>`) styled with the CSS `:focus-visible` pseudo-class for the visible ring — no custom JS focus-trap, no `tabIndex` management, no synthetic keydown handling for Enter/Space (native `<button>`/`<a>` already fire `click` on both natively). This is the native-platform primitive (ladder rung 4) and is what CONSTITUTION P4 asks for ("semantic HTML elements... keyboard-reachable").

- **DD-9 — Test tooling added to `packages/ui`:** the `unit` project (`environment: 'jsdom'`, `globals: true`, `setupFiles: ['./src/setup-tests.ts']`) copies `apps/web`'s existing `vitest.config.ts` and `setup-tests.ts` (`import '@testing-library/jest-dom'`) verbatim — code-style rule 4, since this is the same monorepo's already-proven Vitest+RTL setup, not a new tooling decision. During the build smoke-check, a second `storybook` project was added to the same `vitest.config.ts` via `@storybook/addon-vitest` (`@storybook/addon-vitest/vitest-plugin`'s `storybookTest()`, Chromium via Playwright, `browser: { enabled: true, headless: true }`), per user request when reviewing Storybook's own onboarding recommendations — this runs every `*.stories.tsx` as a real-browser test (including `addon-a11y` axe checks) on top of the jsdom unit project. Vitest was bumped `^2.1.0` → `^3.0.0` repo-wide (`apps/web` and `packages/ui`) since the addon requires Vitest 3+.
