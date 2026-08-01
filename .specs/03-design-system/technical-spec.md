# Technical Spec — Design System
Date: 2026-07-24

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

## Data Layer
N/A — no MongoDB, no persistence (PRODUCT.md `**Layers:** web`, CONSTITUTION P3).

## Service Layer
N/A — no NestJS/backend layer exists in this repo yet (CONSTITUTION P3).

## API Layer
N/A — no backend layer; locale JSON files are served as static assets from `apps/web/public/`, fetched directly by `i18next-http-backend`'s built-in transport (no proxy/API route).

## Frontend

**Routes:** none new — this feature ships no page (functional spec: "does not ship any page content itself").

**Components (new, `packages/ui/`):**

Repo state check: `packages/ui` currently has exactly one demo component (`components/Welcome.tsx` + `welcome.css` + `Welcome.stories.tsx`, CSF3 format) and no test tooling, no `tsconfig.json`. `apps/web` has Tailwind CSS listed as a dependency but **no `tailwind.config.*`, no PostCSS config, no `@tailwind` directives anywhere** — Tailwind is installed but unwired. Actual styling in both `apps/web/src/index.css` and `packages/ui/src/components/welcome.css` is plain hand-written CSS with BEM-ish class names and CSS custom properties. This spec continues that established pattern (code-style rule 4: match existing patterns when conditions match exactly) rather than wiring up Tailwind, since no AC in this feature requires it and introducing a second styling system alongside untouched plain CSS would be scope creep (P2). See DD-7.

| File | Purpose | AC |
|---|---|---|
| `packages/ui/src/tokens.css` | Color/typography/spacing/shape CSS custom properties under `[data-theme="dark"]`, mirrors `DESIGN.md` 1:1 | AC-1 |
| `packages/ui/src/typography.css` | Utility classes `.text-headline-lg`, `.text-headline-md`, `.text-body-lg`, `.text-body-md`, `.text-label-md`, `.text-label-sm` | AC-5 |
| `packages/ui/src/layout.css` | `.grid` (12/8/4-col responsive via media queries) + `.container-max` | AC-7 |
| `packages/ui/src/components/Button.tsx` + `button.css` | `variant: 'primary' \| 'secondary'`, extends `ButtonHTMLAttributes<HTMLButtonElement>` | AC-2 |
| `packages/ui/src/components/Chip.tsx` + `chip.css` | `variant: 'neutral' \| 'success' \| 'error'`, `children` | AC-3 |
| `packages/ui/src/components/Card.tsx` + `card.css` | `header?: ReactNode`, `children` | AC-4 |
| `packages/ui/src/components/Input.tsx` + `input.css` | extends `InputHTMLAttributes<HTMLInputElement>`, `label: string` | AC-8 |
| `packages/ui/src/components/Nav.tsx` + `nav.css` | `brand: ReactNode`, `links: { label: string; to: string }[]`, `cta?: ReactNode` | AC-9 |
| `*.stories.tsx` per component above (CSF3, matches existing `Welcome.stories.tsx` format) | default/hover/focus/disabled states as named story exports | AC-6 |
| `packages/ui/src/components/Typography.stories.tsx` | story-only, non-exported showcase component rendering each `.text-*` class on semantic tags | AC-5, AC-6 |
| `packages/ui/src/components/Grid.stories.tsx` | story-only, non-exported showcase component rendering `.grid`/`.container-max` at each breakpoint | AC-7, AC-6 |
| `packages/ui/src/index.ts` (edit) | adds `import './tokens.css'; import './typography.css'; import './layout.css';` (side effects) + `export * from './components/{Button,Chip,Card,Input,Nav}'` | AC-1, AC-2–4, AC-8, AC-9 |

Button/Chip/Card/Nav/Typography/Grid are plain components — no `forwardRef`, no react-hook-form/zod wiring. `Input` also ships as a plain component (no `forwardRef`) since no form in this feature consumes it via `register()` — *skipped: forwardRef, add when `07-blog`/contact form actually calls `register()` on it.*

**Nav active-link state (AC-9):** uses `react-router-dom`'s `NavLink` (already a dependency of `apps/web`; added to `packages/ui` as a direct dependency here) instead of hand-rolled `location.pathname` comparison — `NavLink` sets `aria-current="page"` and an `isActive` render-prop automatically (code-style rule 2: use the named SDK primitive). `nav.css` styles `.nav__link[aria-current="page"]` in `primary-container` lime, no JS comparison logic written.

**Component convention:** flat files under `packages/ui/src/components/`, one `.tsx` + one lowercase `.css` + one `.stories.tsx` per primitive — mirrors the existing `Welcome.tsx` / `welcome.css` / `Welcome.stories.tsx` triad exactly (code-style rule 4).

**State:** No React Query (no server data), no Zustand (no cross-component client state — every primitive here is stateless/presentational, controlled via props). i18n language state lives in `i18next`'s own internal store + `localStorage`, not Zustand — it's a library-owned concern, not app state (avoids double-owning state per code-style rule "server state in React Query, client state in Zustand — never mix"; i18next is neither).

**Forms:** N/A — no form exists in this feature (AC-8 is the `Input` primitive only; the functional spec explicitly defers the contact/blog form that would use it). No zod schema, no react-hook-form wiring here.

## Mobile
N/A — no mobile in Phase 1 (`PRODUCT.md`: mobile "none — not planned").

## Infrastructure

**New dependencies:**

| Package | Added to | Reason |
|---|---|---|
| `react-router-dom` | `packages/ui` (dependency) | `Nav`'s `NavLink` (AC-9) — version pinned to match `apps/web`'s existing `^6.26.0` |
| `@fontsource-variable/geist-sans` | `packages/ui` (dependency) | Self-hosted Geist for headline/body (AC-5) — avoids a Google Fonts CDN round-trip, protects CONSTITUTION P1 (no external font-loading network hop); confirm exact fontsource package slug at implementation time |
| `@fontsource-variable/jetbrains-mono` | `packages/ui` (dependency) | Self-hosted JetBrains Mono for labels/Button/Chip text (AC-5) |
| `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-http-backend` | `apps/web` (dependency) | AC-10 |
| `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` | `packages/ui` (devDependency) | Test tooling doesn't exist yet in this package — copied verbatim from `apps/web`'s existing `vitest.config.ts`/`setup-tests.ts` pattern (code-style rule 4) |

**Bundle-size risk (per `02-observability` learned pattern):** `i18next` + `react-i18next` + `i18next-browser-languagedetector` are static imports in `apps/web/src/lib/i18n.ts` (unlike Sentry, i18n gates rendering of any future translated text, so it can't be idle-deferred the way the Sentry SDK was) — `i18next-http-backend` keeps the *locale JSON* out of the JS bundle (fetched as a static asset from `public/locales/`, not imported), which is the one part of this stack that legitimately could bloat the bundle if done as static imports instead. Required before merge: `pnpm --filter @me/web build` before/after this feature, gzip diff recorded in the review — CONSTITUTION P1 is a blocking gate, not advisory.

**Font weight/format:** both fontsource packages ship as variable fonts (one file covers the full weight range DESIGN.md's type scale needs: 400/600/700 for Geist, 500/700 for JetBrains Mono) — avoids pulling in one static file per weight.

**Env vars:** none — no config needed for either tokens or i18n init (fixed `fallbackLng`/`ns`/`detection` values, code-style rule "hardcode fixed-scope values").

**Docker services:** none.

**CI changes:** none required — `packages/ui` gains a `test` script (`vitest run`) in `package.json`; `turbo.json`'s existing `test` task (`{}`  — no `dependsOn` beyond `^build`) picks it up automatically via `pnpm test` in the existing CI workflow (`.github/workflows/ci.yml`). No new CI step needed for Storybook build — out of scope, not required by any AC.

**New `packages/ui/tsconfig.json`:** currently absent — add one extending `packages/config/tsconfig.base.json` (matches root `tsconfig.json`'s own pattern) with `"jsx": "react-jsx"`, `"include": ["src"]`, so `type-check` (new script: `tsc --noEmit`) has something to run against; picked up by the existing root `pnpm type-check` → `turbo type-check` command.

## Cross-cutting Concerns

**Auth:** N/A.

**Validation:** N/A for tokens/primitives. `Input` renders whatever `type`/`required`/`pattern` HTML attributes the eventual consumer passes through native prop spreading — no validation logic owned by the primitive itself (that's the future form's react-hook-form + zod concern, not this component's).

**Error handling (AC-10 edge case — "falls back to `en`, never renders a raw key string"):** entirely i18next's built-in fallback chain — if a namespace/key is missing in the active language's loaded resources, `i18next` automatically serves the `fallbackLng` (`en`) value instead of the raw key, with zero custom fallback code written (code-style rule 2). Validated by a unit test (see Testing Strategy) rather than assumed.

**Logging:** N/A — no new logging surface.

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

## Testing Strategy

**Unit tests (Vitest + React Testing Library, `packages/ui/src/**/*.test.tsx` — new for this package):**
- `Button.test.tsx`: renders both variants with correct class; `fireEvent.click` fires `onClick`; `disabled` prevents `onClick` (native `<button disabled>` behavior — asserted, not implemented) — AC-2.
- `Chip.test.tsx`: renders all three variants with correct class; long text content doesn't add any `overflow`/`white-space: nowrap` rule (asserted by *absence* of a truncation class — the edge case is satisfied by not writing truncation CSS at all, not by adding wrap-handling code) — AC-3, edge case.
- `Card.test.tsx`: with/without `header` prop — header renders with border-bottom class only when present — AC-4.
- `Input.test.tsx`: renders `label` associated via `htmlFor`/`id`; `fireEvent.focus` applies focus class — AC-8.
- `Nav.test.tsx`: renders `brand`, `links`, optional `cta`; active `NavLink` gets `aria-current="page"` (rendered inside a `MemoryRouter`, matching the same wrapper used in `Nav.stories.tsx`'s decorator) — AC-9.

**Unit tests (`apps/web/src/lib/i18n.test.ts` — new):**
- Matching-keys check: imports `public/locales/es/common.json` and `public/locales/en/common.json` directly and asserts `Object.keys(es).sort()` equals `Object.keys(en).sort()` — the "working example" required by AC-10.
- Fallback behavior: a throwaway `i18next.createInstance()` initialized synchronously with inline `resources` (no backend/network involved) — `{ lng: 'es', fallbackLng: 'en', resources: { en: { common: { greeting: 'Hello' } }, es: { common: {} } } }` — asserts `t('common:greeting')` returns `'Hello'`, never the literal string `'greeting'` — covers the AC-10 edge case using i18next's own fallback chain, no custom code to test.

**Storybook (`packages/ui`, CSF3 — matches existing `Welcome.stories.tsx` format exactly):** one `*.stories.tsx` per primitive (`Button`, `Chip`, `Card`, `Input`, `Nav`) with named story exports per variant/state (`Primary`, `Secondary`, `Disabled`, `Focused` where applicable — AC-6), plus the two story-only showcases (`Typography.stories.tsx`, `Grid.stories.tsx`, DD-3). `Nav.stories.tsx` wraps stories in a `MemoryRouter` decorator (react-router-dom's own testing primitive) since `NavLink` requires router context.

**Playwright E2E (`apps/e2e`):** N/A — no page exists yet to click through (functional spec: "primitives are independent, no multi-step user journey to document"). Existing `apps/e2e/tests/health.spec.ts` smoke test is unaffected since `App.tsx` is untouched by this feature.
