# Technical Spec — Brand alignment
Date: 2026-10-08

> Web-only (P3). Copy and wiring change: no new dependencies, no new components, no CSS changes. Sections that don't apply are marked N/A.

## Architecture Overview

```
Browser loads /
  ↓
index.html  <html lang="es">  (static, pre-JS: crawlers + first paint)            [AC-1, AC-7]
  ↓
main.tsx → import './lib/i18n'
  1. i18n.init({ lng: 'es', ... })                                                  [AC-1]
     1a. explicit `lng` short-circuits LanguageDetector.detect() → stored 'en' / navigator 'en-US' ignored
     1b. detection.caches: [] → nothing written to localStorage while forced
     1c. 'languageChanged' handler sets document.documentElement.lang = 'es'
  ↓
ErrorBoundary → fallback copy read from i18n (error.title / error.body)             [AC-1]
  ↓
HomePage
  ├─ Header    → <Nav> without `cta` prop → no LanguageToggle rendered              [AC-2]
  ├─ Hero      → new es copy (prefix / highlight / suffix + subcopy)                 [AC-3]
  ├─ Builder   → new pillars fact line, updated human fact + quote                   [AC-4]
  ├─ FeaturedSystems (unchanged)
  └─ Connect   → static subtitle (no nextQuarter), footer + YOUTUBE link             [AC-5, AC-6]
```

The EN locale, the `LanguageDetector` plugin, the `languageChanged` → `<html lang>` sync, the `LanguageToggle` primitive and its story all stay in place, unused by the UI (AC-1, AC-2). To bring English back later: remove `lng`, restore `caches: ['localStorage']`, put the `cta` back in Header, and set `index.html` lang. No copy needs rewriting.

## Data Layer

N/A (no backend; P3).

`apps/web/src/data/builder.ts` (typed static data module):
- Add `pillarsKey: string` to `BuilderProfile`, value `'builder.factPillars'` [AC-4]. Same pattern as the existing `*Key` fields. `humanKey`/`quoteKey` keep their names and only change their copy.

## Service Layer

N/A.

## API Layer

N/A.

## Frontend

**Routes:** none new. **Components:** none new. **State:** none (i18next is the only state, and it is fixed).

### 1. `apps/web/src/lib/i18n.ts` [AC-1]

```ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { home: enHome }, es: { home: esHome } },
    lng: 'es',
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    defaultNS: 'home',
    ns: ['home'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: [],
    },
  });
```
- Update the top comment: `index.html` now ships `lang="es"`, the site is Spanish-only per 07-brand-alignment AC-1, and how to re-enable English.
- `fallbackLng` stays `'en'`. The en/es key-parity test means a fallback can never be hit (DD-2).

### 2. `apps/web/index.html` [AC-1, AC-7]
- `<html lang="es" data-theme="dark">`
- `<title>Jota Fierro — El ingeniero que le pone proceso a todo</title>`, same text for `og:title`
- `description` and `og:description`: `Ingeniero backend senior que le pone proceso a todo: al código y a la vida. Ingeniería y carrera, vida en construcción y biblioteca. YouTube: @fierrojota.`
- No hreflang, no `og:locale` (single language).

### 3. `apps/web/public/manifest.json` [AC-1]
- `"name": "Jota Fierro — Ingeniero de software"`, add `"lang": "es"`. `short_name` unchanged.

### 4. `apps/web/public/llms.txt` [AC-7] (full rewrite, Spanish)

```
# Jota Fierro — El ingeniero que le pone proceso a todo

> Sitio personal de Jonathan "Jota" Fierro, ingeniero backend senior. Le pone
> proceso a todo — al código y a la vida. El sitio es open source y se
> construye con un proceso spec-driven: cada feature se publica con su spec
> funcional, spec técnica, reporte de QA y hallazgos de revisión junto al código.

Los artefactos del proceso son el punto, no un efecto secundario — están en
`.specs/` en el repositorio de abajo.

## Pilares

- Ingeniería y carrera
- Vida en construcción
- Biblioteca

## Sitio

- [Inicio](https://jotafierro.me/): portafolio de una sola página (español), React 19 + Vite.

## Proyectos

- [AURA](https://aura-dev.jotafierro.me/): un RPG mítico de la vida real impulsado por Karma.
- [j-flow](https://github.com/jotafierro/j-flow): framework de Spec-Driven Development con gates, distribuido como plugin de Claude Code.
- [superclean](https://github.com/jotafierro/superclean): utilidad de línea de comandos para limpiar cachés, logs y basura del sistema en macOS.
- [me](https://github.com/jotafierro/me): el código de este sitio, con sus specs e historial de revisiones.

## Canales

- [YouTube](https://www.youtube.com/@fierrojota)

## Contacto

- [Email](mailto:connect@jotafierro.me)
- [GitHub](https://github.com/jotafierro)
- [LinkedIn](https://linkedin.com/in/jotafierro)
```
No services, newsletter or support links (AC-7).

### 5. `apps/web/src/components/home/Header.tsx` [AC-2]
- Remove the `LanguageToggle` import, the `language` const and the `cta` prop. `const { t, i18n }` becomes `const { t }`.
- No CSS change: `.nav` is `grid-template-columns: 1fr auto 1fr`, and `Nav` renders `nav__cta` only when `cta` is truthy. The empty third track keeps the links centered; the indicator measuring is unaffected. On mobile, `.nav__collapsible` just holds the links (DD-1).

### 6. `apps/web/src/components/home/Builder.tsx` [AC-4]
- Add one `<li>{t(builderProfile.pillarsKey)}</li>` after the `humanKey` `<li>`. Markup otherwise unchanged; the 2 stat cards stay.

### 7. `apps/web/src/components/home/Connect.tsx` [AC-5, AC-6]
- Remove the `nextQuarter` import and call. Use `t('connect.subtitle')` with no interpolation.
- Footer `<ul>` order: GITHUB / LINKEDIN / **YOUTUBE** / EMAIL. New item:
  ```tsx
  <li>
    <a href="https://www.youtube.com/@fierrojota" target="_blank" rel="noopener noreferrer">
      {t('connect.footerYoutube')}
    </a>
  </li>
  ```
  No `aria-label`: the accessible name equals the visible text, so label-in-name holds by construction (WCAG 2.5.3). Nothing is added next to the email CTA.
- Delete `apps/web/src/lib/quarter.ts` and `apps/web/src/lib/quarter.test.ts`: Connect was their only consumer (DD-5).
- `connect.headline` becomes `HABLEMOS` (en: `LETS_TALK`), see Connect copy table and Known gaps.

### 8. `apps/web/src/lib/error-boundary.tsx` [AC-1]
- Import the i18n instance: `import i18n from './i18n'`. Replace the two hardcoded strings with `i18n.t('error.title')` and `i18n.t('error.body')` (class component: the `useTranslation` hook does not apply, and the boundary renders outside the React i18n context).
- Safe because `init()` is synchronous with bundled resources: nothing suspends. `main.tsx` already imports `./lib/i18n`, so no new module reaches the bundle.
- If i18n failed to load, the fallback would not render either; accepted, the resources are static JSON (DD-7).

### 9. Copy (`apps/web/src/locales/{es,en}/home.json`) [AC-3, AC-4, AC-5, AC-6]

EN gets the equivalent keys and copy. CLAUDE.md requires both locales, and `i18n.test.ts` enforces key parity. EN is the dormant locale, kept as a faithful translation.

| Key | es (new) | en (new) |
|---|---|---|
| `hero.status` | unchanged | unchanged |
| `hero.headlinePrefix` | `EL INGENIERO QUE LE PONE` | `THE ENGINEER WHO PUTS` |
| `hero.headlineHighlight` | `PROCESO A TODO` | `PROCESS INTO EVERYTHING` |
| `hero.headlineSuffix` | `— AL CÓDIGO Y A LA VIDA.` | `— INTO CODE AND INTO LIFE.` |
| `hero.subcopy` | `Ingeniero backend senior. Construyo software con un proceso spec-driven y aplico ese mismo método a la vida: carrera, familia y lo que vale la pena compartir.` | `Senior backend engineer. I build software with a spec-driven process and apply the same method to life: career, family and what's worth sharing.` |
| `hero.ctaPrimary` / `ctaSecondary` | unchanged | unchanged |
| `builder.factRolePrefix` / `factSpecialization` / `factPhilosophy` | unchanged | unchanged |
| `builder.factHuman` | `> OFFLINE: Esposo · Papá de dos hijas · Entreno básquetbol 🏀` | `> OFFLINE: Husband · Father of two daughters · I train basketball 🏀` |
| `builder.factPillars` (new) | `> PILARES: Ingeniería y carrera · Vida en construcción · Biblioteca` | `> PILLARS: Engineering & career · Life under construction · Library` |
| `builder.quote` | `"Todo lo que ves aquí lo construyo entre las 5:30 y las 9:30 AM, antes de que empiece el día. Proceso en el código, proceso en la vida."` | `"Everything you see here I build between 5:30 and 9:30 AM, before the day starts. Process in code, process in life."` |
| `builder.stat*` | unchanged | unchanged |
| `connect.headline` | `HABLEMOS` | `LETS_TALK` |
| `connect.subtitle` | `¿Una pregunta, una idea o un comentario sobre algo que publiqué? Escríbeme.` | `A question, an idea or a thought on something I published? Write to me.` |
| `connect.footerYoutube` (new) | `YOUTUBE` | `YOUTUBE` |
| `error.title` (new) | `Algo salió mal` | `Something went wrong` |
| `error.body` (new) | `Intenta navegar a otra parte.` | `Please try navigating elsewhere.` |
| `header.languageLabel` | kept (toggle infra kept) | kept |

AC-4's bio points are covered between the role fact (Sr. Backend Developer), `factHuman` (husband, two daughters, basketball) and `quote` (5:30–9:30 AM). No names, ages, photos, money figures, degree claims or contract details.

## Mobile

N/A (P3: web-only).

## Infrastructure

**New env vars:** none. **Docker services:** none. **CI changes:** none (the existing lint / type-check / test / build job covers this).
**Bundle:** roughly neutral. `LanguageDetector` stays bundled as before and `quarter.ts` is removed. No new dependency.

## Cross-cutting Concerns

**Auth:** N/A. **Validation:** N/A. **Logging:** none new.
**Error handling:** the boundary fallback copy moves to the i18n layer (section 8).
**i18n:** every new string goes through the i18n layer, no hardcoded copy added to components (AC-8). The YouTube URL is a literal, matching how the GitHub/LinkedIn hrefs are already written.
**a11y (P4):** `<html lang="es">` set statically and at runtime (WCAG 3.1.1). The toggle is not in the DOM, so not focusable (AC-2). The YouTube link meets label-in-name.
**Constitution references:** this repo's `CONSTITUTION.md` defines P1–P6. The §7.1/§7.3/§7.4 cited in the functional spec belong to the rumbo (brand) constitution, not this repo.

## Design decisions

- **DD-1: Hide the toggle by omitting `Nav`'s `cta` prop, no CSS and no `Nav` change.** `Nav` already supports `cta?` and only renders the wrapper when set; the `1fr auto 1fr` grid keeps links centered. Rejected: CSS `display:none` (dead markup, depends on CSS to leave the focus order) and a placeholder slot in `Nav` (abstraction nothing needs). [AC-2]
- **DD-2: Force Spanish with `lng: 'es'`, keep `LanguageDetector` registered with `caches: []`.** An explicit `lng` makes i18next skip `detect()`, so a stored `i18nextLng=en` and an English `navigator.language` are ignored; `caches: []` stops writes to localStorage. Rejected: removing the plugin/dependency (re-enabling would re-add it) and `detection.order: []` with `fallbackLng: 'es'` (two settings for the same result). `fallbackLng` stays `'en'`; the parity test guarantees no key falls back. [AC-1]
- **DD-3: Static `lang="es"` plus the existing runtime sync.** Covers crawlers and pre-JS; the runtime handler confirms `es`. [AC-1, AC-7]
- **DD-4: Pillars as one terminal-style fact line, not cards.** Pure copy matching the `> KEY: value` list, zero CSS (no redesign, rumbo §7.3). Rejected: 3 pillar cards (grid CSS changes, mono labels too wide for ~220px columns, P5 fit risk at 1024px). Pillar 3 is named "Biblioteca", not "Curaduría" (Jota's call, communicated to rumbo). [AC-4]
- **DD-5: Delete `quarter.ts` and its test.** Connect is the only consumer; an unused module goes against P2. [AC-5]
- **DD-6: EN mirrors every new and changed key.** Required by CLAUDE.md and the parity test; keeps re-enabling English copy-free. [AC-1, AC-8]
- **DD-7: ErrorBoundary reads copy via the `i18n` instance (`i18n.t`), not the hook.** Class component outside the React i18n context; the instance is initialized synchronously. Rejected: Spanish literal in the component (hardcoded copy, violates the i18n convention). [AC-1]

## Testing Strategy

**Unit tests (vitest, `apps/web`):**
- `src/lib/test-i18n.ts`: `lng: 'es'`, so tests render what production renders.
- `src/pages/HomePage.test.tsx`: switch the `en` import to `es`.
  - Header: `queryByRole('group', { name: es.header.languageLabel })` is null and no `EN`/`ES` buttons [AC-2].
  - Hero: prefix/highlight/subcopy from `es` [AC-3].
  - Builder: `getByText(es.builder.factPillars)`, updated `factHuman` and `quote` [AC-4].
  - Connect: `getByText(es.connect.subtitle)`, `queryByText(/Q\d/)` is null; drop the `nextQuarter` import [AC-5].
  - Footer: YOUTUBE link has `href` `https://www.youtube.com/@fierrojota`, `target="_blank"`, `rel="noopener noreferrer"`; order GITHUB, LINKEDIN, YOUTUBE, EMAIL [AC-6].
- `src/App.test.tsx`: heading regex `/engineering for/i` → `/el ingeniero que le pone/i`.
- `src/lib/i18n.test.ts`: keep parity and fallback tests. Add a production-instance test: `localStorage.setItem('i18nextLng', 'en')`, `vi.resetModules()`, dynamic `import('./i18n')`; expect `i18n.language === 'es'` and, via `vi.waitFor`, `document.documentElement.lang === 'es'`. jsdom's `navigator.language` is `en-US`, so this also covers the English-browser edge case [AC-1].
- `src/lib/error-boundary.test.tsx`: import `./test-i18n` and assert `es.error.title` instead of the English literal [AC-1].
- `src/lib/quarter.test.ts`: deleted with the module (DD-5).
- `packages/ui`: unchanged. `LanguageToggle` and `Nav` tests and stories stay green [AC-2].

**NestJS E2E:** N/A. **Flutter integration:** N/A.

**Playwright E2E (`apps/e2e/tests/home.spec.ts`):**
- Rewrite English literals to es copy: nav `['00_INICIALIZAR','01_ACERCA','02_SISTEMAS','03_CONECTAR']`, hero highlight `PROCESO A TODO`, CTAs `INICIALIZAR_VER_SISTEMAS` / `¿QUIÉN_ES_EL_CONSTRUCTOR?`, stat headings `ARQUITECTURA_LIMPIA` / `INNOVACIÓN`, Connect `HABLEMOS`, footer links `GITHUB/LINKEDIN/YOUTUBE/EMAIL`, scroll test via `03_CONECTAR`.
- Replace the AC-11 "selecting ES" test with **"Spanish is forced for an English visitor with stored en"**: `test.use({ locale: 'en-US' })`, `addInitScript` sets `i18nextLng=en`, goto `/`; expect `html[lang=es]`, `.hero__highlight` = `PROCESO A TODO`, `.language-toggle` count 0 [AC-1, AC-2].
- Add **"mobile menu has no toggle"**: viewport 375×812, click `summary.nav__toggle`; the 4 `.nav__link`s visible, one with `aria-current="page"`, `.language-toggle` count 0 [AC-2].
- YouTube: `footer.getByRole('link', { name: 'YOUTUBE' })` has `href`, `target=_blank`, `rel` [AC-6].
- Build must grep `apps/e2e/tests/` for any other spec using English copy or the toggle (only `home.spec.ts` was confirmed during drafting), and `public/` files (`robots.txt`, `sitemap.xml`) for English assumptions.

**QA manual checks:** axe on `/` (desktop + 375px). P5 fit for Hero and Builder at 1024×768 (5 facts + quote + stats, no internal scroll). Footer link row at 320/375px (no horizontal overflow). Hero headline wrap on mobile.

## Files to touch

| File | Change | AC |
|---|---|---|
| `apps/web/src/lib/i18n.ts` | `lng: 'es'`, `caches: []`, comment | AC-1 |
| `apps/web/index.html` | `lang="es"`, title/description/og | AC-1, AC-7 |
| `apps/web/public/manifest.json` | es `name`, `"lang": "es"` | AC-1 |
| `apps/web/public/llms.txt` | Spanish rewrite + YouTube | AC-7 |
| `apps/web/src/components/home/Header.tsx` | drop toggle `cta` | AC-2 |
| `apps/web/src/components/home/Builder.tsx` | + pillars `<li>` | AC-4 |
| `apps/web/src/data/builder.ts` | + `pillarsKey` | AC-4 |
| `apps/web/src/components/home/Connect.tsx` | static subtitle, + YouTube `<li>` | AC-5, AC-6 |
| `apps/web/src/lib/error-boundary.tsx` | copy via `i18n.t` | AC-1 |
| `apps/web/src/locales/es/home.json` | copy per table | AC-3–AC-6, AC-1 |
| `apps/web/src/locales/en/home.json` | mirrored keys | AC-8 |
| `apps/web/src/lib/quarter.ts` | **delete** | AC-5 |
| `apps/web/src/lib/quarter.test.ts` | **delete** | AC-5 |
| `apps/web/src/lib/test-i18n.ts` | `lng: 'es'` | AC-8 |
| `apps/web/src/lib/i18n.test.ts` | + forced-es test | AC-1, AC-8 |
| `apps/web/src/lib/error-boundary.test.tsx` | es assertion via test-i18n | AC-1 |
| `apps/web/src/pages/HomePage.test.tsx` | es assertions, toggle absent, YouTube, pillars | AC-2–AC-6, AC-8 |
| `apps/web/src/App.test.tsx` | es heading regex | AC-8 |
| `apps/e2e/tests/home.spec.ts` | es literals, replace AC-11 test, mobile test | AC-1, AC-2, AC-6, AC-8 |
| `CLAUDE.md` | fix i18n line: translations are bundled from `apps/web/src/locales/`, not loaded over HTTP | — |
| `.specs/_system/landing-page.md` | at `/j-flow-finish` (see below) | — |

**Untouched on purpose:** `packages/ui/src/components/LanguageToggle.*` and its story, `packages/ui/src/components/Nav.tsx`, `nav.css`, `home.css`.

## System spec update at finish (`.specs/_system/landing-page.md`)
- Append a `07-brand-alignment` entry with the AC-1 to AC-7 behaviors.
- Mark the 04-design-polish **AC-11** heading `(Superseded by 07-brand-alignment AC-1/AC-2)`.
- Annotate the stale 04 entries: AC-1 ("between the brand mark and the language toggle", language toggle in the mobile menu), AC-2 (English literals for chip and CTAs), AC-5 (footer links now include YOUTUBE, subtitle is a plain contact line).
- Update the `Last updated` line. Backlog row 07: "YouTube channel button" → "YouTube footer link".

## Known gaps / risks
- **Layout (QA):** Builder gains a 5th fact line (P5 fit at 1024px, `overflow-y: auto` fallback exists). `.connect__footer-links` is a non-wrapping flex row of 4 links; verify at 320px.
- **Status chip:** `hero.status` keeps "LOGICA" without an accent (pre-existing, AC-3 keeps the wording).
- **Connect headline:** changed during smoke check from `CONSTRUYE_SISTEMAS_NOTABLES_AHORA` / `BUILD_REMARKABLE_SYSTEMS_NOW` (an imperative pitch, close to the tone contract clause 8.1 targets) to `HABLEMOS` / `LETS_TALK`. The old headline is a candidate to reactivate once the external-work authorization (B-019) is resolved.
- **Bio source:** copy follows the brand bio provided by rumbo (senior backend, husband, two daughters, basketball, 5:30–9:30 AM). "4 nights a week" and the contract type are intentionally omitted.
