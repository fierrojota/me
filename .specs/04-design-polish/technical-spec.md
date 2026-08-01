# Technical Spec — Design polish (landing route `/`)
Date: 2026-07-28 (revision 12 — functional spec updated again: AC-4 gains a `url` field per project, and clicking anywhere on a Featured Systems card navigates to that `url` in a new tab. AC-4's sizing bullet was also corrected in the functional spec to describe the already-shipped treemap mechanism, since it had stuck on a description of the rejected 3-tier CSS draft since revision 11's mid-revision pivot — no technical-spec change follows from that correction, DD-42/43/44 already documented the treemap accurately.)

> Revision note (rev 12): this replaces the rev-11 spec. Everything below unaffected by rev-12's change — the treemap sizing mechanism itself (DD-42), its CSS-custom-property rendering (DD-43), the tablet/mobile uniform-grid fallback (DD-44), Builder's data module/company link (DD-40/41), the sticky/full-bleed header mechanism, the wordmark rebrand + brand-click-to-Hero (DD-34), the hash-scroll `useEffect` trigger (DD-9), the mobile hamburger disclosure, tablet/mobile layout structure, desktop-only scroll-snap gating, dependency removal, the i18n Suspense foundation, SEO/icons, nav-centering (DD-12), the `LanguageToggle` primitive itself, the dot-grid background, the `useActiveSection` scroll/rAF/`getBoundingClientRect` mechanism (DD-25 REVISED), the Challenges→Connect content swap (DD-33), the Footer→Connect merge (DD-35/36), Connect's rev-10 `<Section>`-bypass + full-bleed footer (DD-38/DD-39) — is carried forward verbatim from rev 11. Only AC-4's two new pieces (`url` field, whole-card click-to-new-tab) are added this revision.
>
> **Checked directly against the actual on-disk code:** `apps/web/src/components/home/{ProjectCard,FeaturedSystems}.tsx`, `apps/web/src/data/projects.ts`, `apps/web/src/pages/home.css` (Featured Systems rules), `packages/ui/src/components/{Card,Chip}.tsx` (confirmed neither renders a nested `<a>`/`<button>` — wrapping the whole card in an `<a>` introduces no nested-interactive-element violation), `packages/ui/src/typography.css` (confirmed zero `color` rules — an anchor-wrapped card would otherwise inherit UA-default link color/underline into the title/description text), `packages/ui/src/components/{input,button,nav,language-toggle}.css` (confirmed `input.css`'s `border-color: var(--primary-container)` focus precedent, and confirmed `button.css`/`nav.css`/`language-toggle.css` each independently repeat `outline: 2px solid var(--primary-container); outline-offset: 2px` — no global focus reset exists in this codebase).
>
> **Builder's rev-7 fixed-height mechanism (DD-28/DD-30 — image `position: absolute`/`object-fit: cover`, text column vertically centered) is unaffected — this revision only changes what data feeds the fact list/quote/stats, not how the section is laid out or sized.** Featured Systems' rev-7 fixed-height mechanism (DD-29/DD-32) is **superseded in part**: the section-level mechanism (the section's own hard `height` cap, `.container-max` filling it via `height:100%; display:flex; flex-direction:column`) is unchanged, but the *grid's own* mechanism (`grid-template-columns: 7fr 5fr` + `grid-template-rows: repeat(3, 1fr)`, correct only for exactly "1 large spanning 3 rows + 3 equal smalls") is replaced entirely by a JS-computed treemap — see DD-42/43/44 below. This was a **two-pass design within this revision**: an initial draft kept a static 3-tier CSS-class system (`sizeForWeight`: large/medium/small + `grid-auto-flow: dense`), hand-verified only for the current 4-project dataset — the user caught that this wouldn't generalize to a re-curated list of 2, 3, 5, or 6 projects, and asked for a mechanism that recomputes automatically for any count. The treemap below is the corrected design; the rejected dense-grid draft is not reproduced here.
>
> **New project-wide principle this revision surfaced: `CONSTITUTION.md` gained P5 ("full-height, page-like sections")**, promoting AC-13's full-height/scroll-snap section pattern from a one-feature choice to a durable structural rule, at the user's explicit request while reviewing this revision's Featured Systems redesign.
>
> **Checked directly against the actual on-disk code, not against any prior spec's description of it:** `apps/web/src/components/home/{Builder,FeaturedSystems,ProjectCard}.tsx`, `apps/web/src/components/home/ProjectCard.test.tsx`, `apps/web/src/data/{projects,projects.test}.ts`, `apps/web/src/pages/{home.css,HomePage.test.tsx}`, `apps/web/public/locales/{en,es}/home.json`, `packages/ui/src/{layout.css,tokens.css}`, `packages/ui/src/components/Card.tsx` (confirmed the exact `.card`/`.card__body` class names the existing Featured Systems CSS already targets; confirmed `--spacing-gutter-desktop: 24px` exists in `tokens.css`), `CONSTITUTION.md` (P5, just added).

## Architecture Overview

**New this revision:** two independent, non-overlapping content changes within the already-established "pure UI composition on existing primitives" architecture — no new primitive, no new dependency, no new route.

1. **Builder (AC-3):** `Builder.tsx` now imports its role/specialization/philosophy/quote/stat content from a new local data module, `apps/web/src/data/builder.ts` (DD-40) — an i18n-key-path-holding typed object, mirroring `data/projects.ts`'s existing pattern exactly (same rationale as DD-14: a future backend/admin can manage the same shape without a component rewrite). The `CURRENT_ROLE` fact is split into a translatable prefix (`builder.factRolePrefix`, i18n key) and a literal, non-translated `company: { name, url }` field, rendered as `{prefix} <a href={company.url} target="_blank" rel="noopener noreferrer">{company.name}</a>` (DD-41).
2. **Featured Systems (AC-4/AC-13):** `data/projects.ts`'s 4 placeholder entries are replaced with the author's 4 real repos (`superclean`, `r-backend-task-tracker-cli` → id `backendTaskTracker`, `j-utils`, `wrapper-path`) — all four, like the existing `fzConnect` entry before them, omit `image`/`imageAlt` and render via the already-built SVG-glyph fallback path in `ProjectCard.tsx` (no new asset, no new component). Card sizing is redesigned from the old "1 large slot (highest weight) + rest small" rule into a recursive treemap (`apps/web/src/lib/treemap.ts`, DD-42) — a pure function that bisects the item list by weight at each level, alternating split axis, so every project's final rendered area is always exactly `total area × (its weight / sum of all weights currently in the list)`, for any project count. Rendering is `position: absolute` cards driven by inline CSS custom properties, active only at the existing `≥1024px` breakpoint (DD-43); below that, every card gets equal, uniform CSS Grid treatment (DD-44). The AC-13 fixed-height mechanism (the section/container-max level) is unaffected — only the grid's own internal layout mechanism changes.

```
apps/web/src/pages/HomePage.tsx          — composes the route, in DOM order (unchanged this revision):
  1. <Header>            unchanged this revision
  2. <main>
       <Hero>            unchanged this revision
       <Builder id="the-builder" class="section--snap">   NEW THIS REVISION: fact
                          list's CURRENT_ROLE item renders a real <a> (company
                          link); role/specialization/philosophy/quote/stat copy
                          now sourced from `data/builder.ts` (DD-40/DD-41) —
                          layout/sizing/height mechanism (DD-28/DD-30) untouched
       <FeaturedSystems id="featured-systems" class="section--snap">  NEW THIS
                          REVISION: 4 real projects from `data/projects.ts`,
                          sized via a recursive treemap (DD-42) rendered as
                          absolutely-positioned cards driven by CSS custom
                          properties, desktop-only (DD-43); tablet/mobile keep
                          a uniform, weight-agnostic grid (DD-44)
       <Connect id="connect" class="section connect section--snap">  unchanged
                          this revision
     </main>
  ↓
Everything else — semantic landmarks, responsive breakpoints (AC-8), native
`:focus-visible` (AC-9), sticky header (AC-1), `.section`'s `scroll-margin-top`,
global `scroll-behavior: smooth` + `scroll-snap-type: y proximity`, the dot-grid
background (AC-12), `useTranslation('home')` per section (AC-11), Connect's
rev-10 hand-rolled `<section>` + full-bleed footer (DD-38/DD-39) — unchanged
this revision, carried forward verbatim from rev 10.
```

## Data Layer
N/A — no persistence, no MongoDB (`PRODUCT.md` **Layers:** `web`; CONSTITUTION P3). Two typed local TS data modules now exist for this reason: `apps/web/src/data/projects.ts` (Featured Systems — contents replaced this revision, shape unchanged) and, new this revision, `apps/web/src/data/builder.ts` (Builder's role/specialization/philosophy/quote/stats) — neither is a database collection.

## Service Layer
N/A — no NestJS/backend layer exists in this repo (CONSTITUTION P3).

## API Layer
N/A — no backend. Unchanged from prior revisions.

## Frontend

**Files — unaffected by revision 11, carried forward verbatim:** `App.tsx`, `lib/i18n.ts`, `lib/test-i18n.ts`, `components/home/Section.tsx`, `Header.tsx`, `Hero.tsx`, `Connect.tsx`, `HomePage.tsx` (no import/JSX change — `<Builder />`/`<FeaturedSystems />` are still rendered the same way; only what they render internally, and what data they read, changes), `packages/ui/src/components/{Nav.tsx,nav.css,LanguageToggle.*,Card.tsx,card.css}`, `packages/ui/src/{layout.css,tokens.css}`, `packages/ui/src/index.ts`, `apps/web/index.html`, `apps/web/src/hooks/useActiveSection.ts`, `apps/web/src/index.css`, `apps/e2e/tests/nav-underline.spec.ts`.

**Files — new, edited, or deleted for revision 11's ACs:**

| File | Change | AC |
|---|---|---|
| `apps/web/src/data/builder.ts` (new) | Typed data module holding i18n key-path strings for role/specialization/philosophy/quote/stats, plus a literal (non-i18n) `company: { name, url }` field. Mirrors `data/projects.ts`'s shape/rationale (DD-40) | AC-3 |
| `apps/web/src/components/home/Builder.tsx` (edit) | Imports `builderProfile` from the new data module. Renders the `CURRENT_ROLE` `<li>` as `{t(prefix)} <a href target=_blank rel=noopener noreferrer>{company.name}</a>`. Stats rendered via `builderProfile.stats.map()` instead of two hand-copied `<Card>` blocks | AC-3 |
| `apps/web/src/lib/treemap.ts` (new) | Pure function: recursive slice-and-dice treemap, `{weight}[]` → `Rect[]` (percentages) | AC-4 |
| `apps/web/src/lib/treemap.test.ts` (new) | Unit tests: N=1 base case, equal-weight/dominant-weight areas, no-gaps for N=2/3/5, in-bounds coordinates, input-order preservation | AC-4 |
| `apps/web/public/locales/{en,es}/home.json` (edit) | `builder.factRole` deleted; new `builder.factRolePrefix` added. `featuredSystems.{auraCore,kineticUi,fzConnect,nebulaFlux}` deleted; new `featuredSystems.{superclean,backendTaskTracker,jUtils,wrapperPath}` keys added (`tag`/`title`/`description` each, no `imageAlt` — none of the 4 have images) | AC-3, AC-4 |
| `apps/web/src/data/projects.ts` (edit) | 4 placeholder entries replaced with the 4 real repos (weights 800/450/200/200, verbatim from the functional spec). `sortByWeightDesc` deleted — sorting is now an internal implementation detail of `treemap()` | AC-4 |
| `apps/web/src/data/projects.test.ts` (delete) | Only test was for `sortByWeightDesc`, now removed | AC-4 |
| `apps/web/src/components/home/ProjectCard.tsx` (edit) | Drops the `size` prop and the `.project-card-cell` wrapper it used to render — becomes a purely presentational tag/title/description/image component; sizing is now a `FeaturedSystems.tsx`-owned wrapper concern | AC-4 |
| `apps/web/src/components/home/ProjectCard.test.tsx` (edit) | Removes the two `size`-class tests (large/default-small); image/glyph-fallback tests unaffected | AC-4 |
| `apps/web/src/components/home/FeaturedSystems.tsx` (edit) | Renders the `.project-card-cell` wrapper itself, computing `treemap(projects)` once per render and setting `--rect-*` custom properties per card from its output | AC-4 |
| `apps/web/src/pages/home.css` (edit) | New `.builder__facts a` link styling. Featured Systems block fully rewritten: desktop grid replaced by `position: relative`/`absolute` + `--rect-*` custom properties; tablet/mobile keep a simple uniform grid (no tier classes) — see CSS deltas below | AC-3, AC-4, AC-13 |
| `apps/web/src/pages/HomePage.test.tsx` (edit) | AC-3: `factRolePrefix` + company-link assertions replace the old `factRole` text assertion. AC-4: real project titles replace placeholders; the old "large-slot class" test is replaced with two tests asserting computed `--rect-*` area (superclean > jUtils; jUtils ≈ wrapperPath) | AC-3, AC-4 |
| `apps/web/src/assets/projects/{aura-core,kinetic-ui,nebula-flux}.webp` (delete) | Orphaned once `projects.ts` no longer imports them — none of the 4 real repos have screenshot assets (functional spec Edge cases); deleting avoids shipping dead, unreferenced binary assets | AC-4 |

No new dependency, no `packages/ui` change — no Storybook story change.

**Files — new or edited for revision 12's AC (AC-4 only):**

| File | Change | AC |
|---|---|---|
| `apps/web/src/data/projects.ts` (edit) | `url: string` added to `Project` (required); 4 real GitHub URLs populated | AC-4 |
| `apps/web/src/components/home/FeaturedSystems.tsx` (edit) | `.project-card-cell` wrapper retagged `<div>` → `<a href target=_blank rel=noopener noreferrer aria-label>`; same `className`/`style` (`--rect-*` unchanged) | AC-4 |
| `apps/web/src/pages/home.css` (edit) | `.project-card-cell` gains a `color`/`text-decoration` reset plus hover/`:focus-visible` border + outline affordance (DD-46/47) | AC-4 |
| `apps/web/src/pages/HomePage.test.tsx` (edit) | New AC-4 test: each card is a link to its `url`, `target="_blank"`, `rel="noopener noreferrer"` | AC-4 |

**Unaffected, carried forward verbatim from rev 11:** `ProjectCard.tsx`, `ProjectCard.test.tsx`, `lib/treemap.ts`, `lib/treemap.test.ts`, `data/builder.ts`, `Builder.tsx`, all i18n files.

---

### AC-3 (revision 11) — `CURRENT_ROLE` company link + Builder content data module (DD-40, DD-41)

**The data module.** `apps/web/src/data/builder.ts`:
```ts
export type BuilderStat = {
  labelKey: string; // i18n key path
  titleKey: string; // i18n key path
  bodyKey: string; // i18n key path
};

export type BuilderProfile = {
  roleKey: string; // i18n key path — prefix text rendered before the company link
  company: { name: string; url: string };
  specializationKey: string; // i18n key path
  philosophyKey: string; // i18n key path
  quoteKey: string; // i18n key path
  stats: BuilderStat[];
};

export const builderProfile: BuilderProfile = {
  roleKey: 'builder.factRolePrefix',
  company: { name: 'Fz Sports', url: 'https://www.fzsports.com/' },
  specializationKey: 'builder.factSpecialization',
  philosophyKey: 'builder.factPhilosophy',
  quoteKey: 'builder.quote',
  stats: [
    { labelKey: 'builder.stat1Label', titleKey: 'builder.stat1Title', bodyKey: 'builder.stat1Body' },
    { labelKey: 'builder.stat2Label', titleKey: 'builder.stat2Title', bodyKey: 'builder.stat2Body' },
  ],
};
```
**Why key-path strings, not resolved copy (DD-40).** Identical rationale to `data/projects.ts`'s `tag`/`title`/`description` fields (DD-14): the *content* (English/Spanish prose) still lives in `home.json` and flows through the existing i18next pipeline — the data module only owns the *shape*. A future backend/admin producing this same shape wouldn't need to also reimplement translation.

**Why `company` is literal data, not an i18n key path (DD-41, part 1).** The company name and URL don't vary by locale — confirmed directly: both `en` and `es` `home.json` already contain the identical literal `Fz_Sports` substring inside `factRole` today. A URL is never translated either way. Routing `company.name`/`company.url` through i18n would add a translation-round-trip risk (the Risks section already flags "mistranslation or missed keys" as real) for a value that will never actually differ between languages.

**Splitting the fact string (DD-41, part 2).** Old: one i18n string, `factRole: "> CURRENT_ROLE: Backend Developer / Fz_Sports"`, rendered as plain text — impossible to make part of it a link without either (a) `dangerouslySetInnerHTML` (rejected — no HTML-in-i18n pattern exists anywhere else in this codebase) or (b) splitting the string. Chosen: split into a translatable prefix (`builder.factRolePrefix`, ends at the `/`) and the company name/URL as `builderProfile.company`, joined in JSX with an explicit space:
```tsx
<li>
  {t(builderProfile.roleKey)}{' '}
  <a href={builderProfile.company.url} target="_blank" rel="noopener noreferrer">
    {builderProfile.company.name}
  </a>
</li>
```
Copy (both locales — company name drops the underscore, becomes "Fz Sports"):
```json
// en
"factRolePrefix": "> CURRENT_ROLE: Backend Developer /"
// es
"factRolePrefix": "> ROL_ACTUAL: Backend Developer /"
```
`builder.factRole` is deleted outright from both locale files — dead key, not kept "just in case" (same treatment `challenges.*` got in rev 8).

**Link attributes.** `target="_blank" rel="noopener noreferrer"` per AC-3's literal text — `noopener` prevents the opened page from getting a `window.opener` reference back to `/`; `noreferrer` additionally withholds the `Referer` header. First outbound `target="_blank"` link on the page — the attribute pair itself is a browser primitive, not a new library/pattern.

**Visual treatment — lime + underline, matching `.featured-systems__github`'s existing inline-outbound-link precedent, not the Connect footer's neutral utility-nav-list styling:**
```css
.builder__facts a {
  color: var(--primary-container);
  text-decoration: underline;
}
```

**No per-card GitHub link field considered, and explicitly rejected.** The Featured Systems `Project` type's fields (`id`, `tag`, `title`, `description`, `imageAlt`, `weight`, optional `image`) don't include a URL/link field, and no bullet in AC-4 asks cards to link out to their own repo — the existing top-level `OPEN_GITHUB [ALL]` link already covers that. Adding one now would be an unrequested, speculative feature.

---

### AC-4 (revision 11) — real project data + recursive treemap sizing (DD-42, DD-43, DD-44)

**Real project data.** `apps/web/src/data/projects.ts`, full replacement of the 4 entries:
```ts
export type Project = {
  id: string;
  tag: string; // i18n key path
  title: string; // i18n key path
  description: string; // i18n key path
  imageAlt?: string; // i18n key path — present only when `image` is set
  tagVariant?: 'success' | 'neutral';
  weight: number;
  image?: { src: string; width: number; height: number };
};

export const projects: Project[] = [
  { id: 'superclean', tag: 'featuredSystems.superclean.tag', title: 'featuredSystems.superclean.title', description: 'featuredSystems.superclean.description', weight: 800 },
  { id: 'backendTaskTracker', tag: 'featuredSystems.backendTaskTracker.tag', title: 'featuredSystems.backendTaskTracker.title', description: 'featuredSystems.backendTaskTracker.description', weight: 450 },
  { id: 'jUtils', tag: 'featuredSystems.jUtils.tag', title: 'featuredSystems.jUtils.title', description: 'featuredSystems.jUtils.description', tagVariant: 'neutral', weight: 200 },
  { id: 'wrapperPath', tag: 'featuredSystems.wrapperPath.tag', title: 'featuredSystems.wrapperPath.title', description: 'featuredSystems.wrapperPath.description', tagVariant: 'neutral', weight: 200 },
];
```
i18n (`en`):
```json
"superclean": { "tag": "[ CLI_TOOLS ]", "title": "SUPERCLEAN", "description": "Command-line utility for clearing macOS caches, logs, and system trash." },
"backendTaskTracker": { "tag": "[ CLI_TOOLS ]", "title": "R_BACKEND_TASK_TRACKER_CLI", "description": "Backend task-tracker CLI solving roadmap.sh's Backend track — command parsing, JSON persistence, CRUD via terminal." },
"jUtils": { "tag": "[ DEV_UTILS ]", "title": "J_UTILS", "description": "TypeScript utilities and proof-of-concept experiments." },
"wrapperPath": { "tag": "[ DEV_UTILS ]", "title": "WRAPPER_PATH", "description": "Lightweight wrapper around Node's path module." }
```
`es`:
```json
"superclean": { "tag": "[ HERRAMIENTAS_CLI ]", "title": "SUPERCLEAN", "description": "Utilidad de línea de comandos para limpiar cachés, logs y la papelera del sistema en macOS." },
"backendTaskTracker": { "tag": "[ HERRAMIENTAS_CLI ]", "title": "R_BACKEND_TASK_TRACKER_CLI", "description": "CLI de seguimiento de tareas backend que resuelve el track de Backend de roadmap.sh — parsing de comandos, persistencia en JSON, CRUD por terminal." },
"jUtils": { "tag": "[ UTILIDADES_DEV ]", "title": "J_UTILS", "description": "Utilidades en TypeScript y experimentos de prueba de concepto." },
"wrapperPath": { "tag": "[ UTILIDADES_DEV ]", "title": "WRAPPER_PATH", "description": "Wrapper ligero alrededor del módulo path de Node." }
```
None of the 4 populate `image` — all render via `ProjectCard`'s existing SVG-glyph fallback branch (zero new asset, zero new component; the same path `fzConnect` used pre-rev-11). The 3 now-orphaned placeholder `.webp` files are deleted, not left as dead bytes in the repo. Two pairs share an identical tag string (`CLI_TOOLS`, `DEV_UTILS`) — kept as independently duplicated per-project i18n keys, not extracted into a shared key, per `code-style.md`'s "don't spec abstractions unless reused across 3+ places" (each tag is reused only 2×, and no prior project ever shared a `tag` key either).

**Why the old "1 large slot (highest weight) + rest small" rule doesn't work, confirmed by reading `FeaturedSystems.tsx` directly.** It destructured the weight-sorted list into `[featured, ...rest]` with `size={index === 0 ? 'large' : 'small'}` — a binary rule with no middle tier, and, worse, hardcoded packing math that only produces a correct layout for exactly "1 large + N equal smalls." An intermediate draft this revision replaced this with a fixed 3-tier CSS-class system (`sizeForWeight`, large/medium/small thresholds + `grid-auto-flow: dense`) — the user rejected it: its packing math was only hand-verified for the current 4-project dataset, and wouldn't automatically recompute for a re-curated list of 2, 3, 5, or 6 projects.

**The fix: a recursive treemap, computed in TypeScript at render time, not a CSS-class tier system.** New pure function, `apps/web/src/lib/treemap.ts`:
```ts
export type WeightedItem = { weight: number };
export type Rect = { top: number; left: number; width: number; height: number };

/**
 * Recursive "slice-and-dice" treemap (Shneiderman 1991): bisects the item
 * list by weight sum at each level, alternating split axis, so every leaf's
 * final area is exactly totalArea * (itemWeight / sumOfAllWeights) — this
 * holds by construction (each split's area ratio telescopes down to the
 * leaf, regardless of tree shape). No gaps, no overlaps, any N >= 1.
 * Returns one rect per input item, in the SAME order as `items` — sorting
 * happens on an internal copy only.
 */
export function treemap(items: WeightedItem[]): Rect[] {
  const order = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.weight - a.item.weight); // stable: ties keep original order

  const rects: Rect[] = new Array(items.length);
  split(order, { top: 0, left: 0, width: 100, height: 100 }, 'x', rects);
  return rects;
}

function split(
  entries: { item: WeightedItem; index: number }[],
  rect: Rect,
  axis: 'x' | 'y',
  out: Rect[],
): void {
  if (entries.length === 1) {
    out[entries[0].index] = rect;
    return;
  }

  const weights = entries.map((e) => e.item.weight);
  const total = weights.reduce((sum, w) => sum + w, 0);

  let cut = 1;
  let bestDiff = Infinity;
  let prefix = 0;
  for (let i = 1; i < weights.length; i++) {
    prefix += weights[i - 1];
    const diff = Math.abs(prefix - (total - prefix));
    if (diff < bestDiff) {
      bestDiff = diff;
      cut = i;
    }
  }

  const firstGroup = entries.slice(0, cut);
  const firstWeight = weights.slice(0, cut).reduce((sum, w) => sum + w, 0);
  // ponytail: guards against literal all-zero-weight data (avoids NaN from
  // dividing by 0) — falls back to an even count-based split. Not a
  // trust-boundary guard; this data is a static local TS array, not user input.
  const firstShare = total === 0 ? cut / entries.length : firstWeight / total;
  const nextAxis = axis === 'x' ? 'y' : 'x';

  if (axis === 'x') {
    const firstWidth = rect.width * firstShare;
    split(firstGroup, { ...rect, width: firstWidth }, nextAxis, out);
    split(entries.slice(cut), { ...rect, left: rect.left + firstWidth, width: rect.width - firstWidth }, nextAxis, out);
  } else {
    const firstHeight = rect.height * firstShare;
    split(firstGroup, { ...rect, height: firstHeight }, nextAxis, out);
    split(entries.slice(cut), { ...rect, top: rect.top + firstHeight, height: rect.height - firstHeight }, nextAxis, out);
  }
}
```

**Why this guarantees no gaps and exact proportionality, for any N (the actual math, not asserted, DD-42).** At every split, a subgroup's rect area is `parentArea × (subgroupWeight / parentGroupWeight)`. Following any leaf down its ancestor chain, the ratios multiply out to `leafWeight / totalRootWeight` regardless of how the tree happens to branch — so every leaf's final area is always exactly `total_area × (its own weight / sum of all weights)`, independent of tree shape or item count. Total leaf area therefore always sums to exactly the container's full area (100 × 100) — no gaps, no overlap, by construction. Equal weight → the bisection always lands on an even split for that pair → identical rects, for any N. A dominant weight → proportionally larger rect. Adding/removing/reweighting a project recomputes the whole layout automatically — no hand-verification needed per dataset.

**Sort order — internal, descending by weight, justified.** `treemap()` sorts a copy of the input by weight descending (stable — ties keep original order) before bisecting, then writes results back into the caller's original array order. Not required for the area guarantee (that telescoping argument holds for any grouping) — chosen because grouping the largest items together first produces the more legible "prominent card gets one prominent, undivided region" visual result, rather than a split driven by whatever order projects happen to be authored in the data file.

**Worked example for the current 4 real projects (illustrative only — computed by the function, nothing here is hardcoded):** weights 800/450/200/200 (sum 1650) → split #1 (axis x): {800} vs {450,200,200} → 48.48%/51.52% width; split #2 (axis y, inside the 51.52% column): {450} vs {200,200} → 52.94%/47.06% height; split #3 (axis x): {200} vs {200} → 50%/50% width. Resulting areas: 48.48%, 27.28%, 12.12%, 12.12% — sums to exactly 100%. Adding a 5th project tomorrow produces a different, still-exact tiling with zero code changes.

**Rendering — CSS custom properties, not literal inline style props, desktop-only (DD-43).** `.featured-systems__grid` becomes `position: relative` (only inside the existing `≥1024px` media query) with the section's existing fixed height (unchanged from DD-29/DD-32). Each card's wrapper gets `--rect-top`/`--rect-left`/`--rect-width`/`--rect-height` custom properties set inline from `treemap()`'s output; only the `≥1024px` block consumes them as real `top`/`left`/`width`/`height` via `position: absolute`. Literal inline `top`/`width` style props (rather than custom properties) would apply at every viewport width, since inline styles beat any external stylesheet rule without `!important` — that would fight the tablet/mobile natural-height CSS Grid stacking this feature already relies on, and the only fix would be a JS `matchMedia`/resize-listener breakpoint hook, which this codebase has never needed for any other responsive behavior (CONSTITUTION P1/P2). Routing values through custom properties keeps tablet/mobile 100% CSS-driven, unchanged.

```tsx
<div
  key={project.id}
  className="project-card-cell"
  style={{
    '--rect-top': `${rects[index].top}%`,
    '--rect-left': `${rects[index].left}%`,
    '--rect-width': `${rects[index].width}%`,
    '--rect-height': `${rects[index].height}%`,
  } as React.CSSProperties}
>
  <ProjectCard tag={t(project.tag)} tagVariant={project.tagVariant} title={t(project.title)} description={t(project.description)} />
</div>
```

**Gutter — reuses `--spacing-gutter-desktop` (24px, confirmed present in `packages/ui/src/tokens.css`), no new value invented.** `.project-card-cell` gets `box-sizing: border-box; padding: calc(var(--spacing-gutter-desktop) / 2)` (12px each edge) — between two adjacent cards this reproduces the same 24px total gap this grid already used.

**Tablet/mobile (<1024px): treemap does NOT apply (DD-44).** AC-13's full-height/scroll-snap mechanism — which the treemap exists to serve, since an exact-area-tiling layout only matters when the section's height is hard-capped — is explicitly desktop-only; `tablet.png`/`mobile.png` show uniformly-sized stacked/2-col cards, not size-tiered ones; nothing in AC-8 asks for weight-derived sizing below desktop. Below 1024px every card gets equal treatment: a uniform 2-col grid at ≥768px, single column below that.

**`ProjectCard`'s `size` prop is dropped entirely, not reduced.** Sizing is now a `FeaturedSystems.tsx`-owned wrapper concern; `ProjectCard` becomes a purely presentational tag/title/description/image component. Checked the functional spec for anything that would justify keeping a reduced `size` prop (e.g. font-size scaling at very large/small rects) — nothing asks for that, so nothing is added.

```tsx
// apps/web/src/components/home/ProjectCard.tsx
export type ProjectCardProps = {
  tag: string;
  tagVariant?: 'success' | 'neutral';
  title: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export function ProjectCard({ tag, tagVariant = 'success', title, description, image }: ProjectCardProps) {
  return (
    <Card>
      <div className="project-card__body">
        <Chip variant={tagVariant}>{tag}</Chip>
        <h3 className="text-headline-md">{title}</h3>
        <p className="text-body-md">{description}</p>
      </div>
      {image ? (
        <img className="project-card__image" src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      ) : (
        <svg className="project-card__glyph" viewBox="0 0 40 40" width={40} height={40} aria-hidden="true">
          <circle cx="20" cy="20" r="3" fill="var(--primary-container)" />
          <path d="M12 20a8 8 0 0 1 16 0" stroke="var(--primary-container)" strokeWidth="2" fill="none" />
          <path d="M6 20a14 14 0 0 1 28 0" stroke="var(--primary-container)" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
      )}
    </Card>
  );
}
```

```tsx
// apps/web/src/components/home/FeaturedSystems.tsx
export function FeaturedSystems() {
  const { t } = useTranslation('home');
  const rects = treemap(projects); // cheap for single-digit N — no memoization needed

  return (
    <Section id="featured-systems" className="featured-systems section--snap">
      <div className="featured-systems__heading">
        <div>
          <h2 className="text-headline-lg">{t('featuredSystems.heading')}</h2>
          <p className="text-body-md">{t('featuredSystems.subcopy')}</p>
        </div>
        <a href="https://github.com/jotafierro" className="featured-systems__github text-label-md">
          {t('featuredSystems.githubLink')}
        </a>
      </div>
      <div className="grid featured-systems__grid">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card-cell"
            style={{
              '--rect-top': `${rects[index].top}%`,
              '--rect-left': `${rects[index].left}%`,
              '--rect-width': `${rects[index].width}%`,
              '--rect-height': `${rects[index].height}%`,
            } as React.CSSProperties}
          >
            <ProjectCard tag={t(project.tag)} tagVariant={project.tagVariant} title={t(project.title)} description={t(project.description)} />
          </div>
        ))}
      </div>
    </Section>
  );
}
```
Note: DOM/tab order is simply `projects`' data-source order (no longer reshuffled to put the heaviest-weight item first) — visual placement/size is entirely decoupled from reading order.

**Does AC-13's hard fixed-height mechanism still hold? Yes — more robustly than the rejected design, and for any N, not just this dataset.** The treemap's rects always sum to exactly 100%×100% of the container by construction (proven above) — the section-level fixed-height mechanism (`.featured-systems > .container-max { height: 100%; display: flex; flex-direction: column }`, unchanged from DD-29/DD-32) still supplies a definite-height container for the grid to fill; the grid itself no longer needs to know or hardcode a row count, because percentage-based absolute positioning against a definite-height parent always exactly fills it, regardless of how many projects exist. This is a strictly more general solution to AC-13 for Featured Systems than the old CSS-Grid-row-count approach — it doesn't need re-deriving the next time the project count changes.

---

### AC-4 (revision 12) — `url` field + whole-card click-to-new-tab (DD-45, DD-46, DD-47, DD-48)

**`Project` gains a required `url: string`** (not optional — every current project has one, and AC-4's text gives no exception case):
```ts
export type Project = {
  id: string;
  tag: string;
  title: string;
  description: string;
  imageAlt?: string;
  tagVariant?: 'success' | 'neutral';
  weight: number;
  url: string; // NEW, rev 12 — the whole card navigates here
  image?: { src: string; width: number; height: number };
};

export const projects: Project[] = [
  { id: 'superclean', tag: 'featuredSystems.superclean.tag', title: 'featuredSystems.superclean.title', description: 'featuredSystems.superclean.description', weight: 800, url: 'https://github.com/jotafierro/superclean' },
  { id: 'backendTaskTracker', tag: 'featuredSystems.backendTaskTracker.tag', title: 'featuredSystems.backendTaskTracker.title', description: 'featuredSystems.backendTaskTracker.description', weight: 450, url: 'https://github.com/jotafierro/r-backend-task-tracker-cli' },
  { id: 'jUtils', tag: 'featuredSystems.jUtils.tag', title: 'featuredSystems.jUtils.title', description: 'featuredSystems.jUtils.description', tagVariant: 'neutral', weight: 200, url: 'https://github.com/jotafierro/j-utils' },
  { id: 'wrapperPath', tag: 'featuredSystems.wrapperPath.tag', title: 'featuredSystems.wrapperPath.title', description: 'featuredSystems.wrapperPath.description', tagVariant: 'neutral', weight: 200, url: 'https://github.com/jotafierro/wrapper-path' },
];
```

**Where the anchor goes — `FeaturedSystems.tsx`'s existing `.project-card-cell` wrapper (retagged from `<div>` to `<a>`), not a new prop on `ProjectCard` (DD-45).** That wrapper is already the positioned element carrying the `--rect-*` custom properties (DD-42/43) — `position: absolute`/grid-item, both unconditionally "blockified" per the CSS Display spec regardless of the element's tag — so retagging it needs zero new sizing CSS. Giving `ProjectCard` its own internal `<a>` would need a second, redundant fill-the-parent wrapper just to make the click target match the already-sized cell. `ProjectCard.tsx` is untouched this revision.

```tsx
// apps/web/src/components/home/FeaturedSystems.tsx — only the per-card element changes
{projects.map((project, index) => (
  <a
    key={project.id}
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={t(project.title)}
    className="project-card-cell"
    style={{
      '--rect-top': `${rects[index].top}%`,
      '--rect-left': `${rects[index].left}%`,
      '--rect-width': `${rects[index].width}%`,
      '--rect-height': `${rects[index].height}%`,
    } as CSSProperties}
  >
    <ProjectCard tag={t(project.tag)} tagVariant={project.tagVariant} title={t(project.title)} description={t(project.description)} />
  </a>
))}
```
`target="_blank"` + `rel="noopener noreferrer"` — same pair already used for the `OPEN_GITHUB [ALL]` link and Builder's `Fz Sports` link (DD-41), a browser primitive, not a new pattern.

**Why `.project-card-cell` needs a `color`/`text-decoration` reset (DD-46).** Confirmed by reading `typography.css`: `.text-headline-md`/`.text-body-md` (the card's title/description) set no `color` of their own. `color` is inherited, so without a reset the title/description would inherit the UA-default anchor color; UA-default underline similarly propagates unless reset:
```css
.project-card-cell {
  color: inherit;
  text-decoration: none;
}
```

**Hover/focus affordance — reusing existing precedent, nothing new invented (DD-47).** No "clickable card" convention exists in `DESIGN.md` yet. Two existing precedents, not a third: `input.css`'s focus state does `border-color: var(--primary-container)` on its own bordered box (the closest "border shifts to lime" precedent, matching `DESIGN.md`'s "Focused/active borders: primary-container"); and `button.css`/`nav.css`/`language-toggle.css` each independently repeat `outline: 2px solid var(--primary-container); outline-offset: 2px` on `:focus-visible` — no global reset exists, so this element needs its own copy of the same rule, not a new visual language:
```css
.project-card-cell:hover .card,
.project-card-cell:focus-visible .card {
  border-color: var(--primary-container);
}

.project-card-cell:focus-visible {
  outline: 2px solid var(--primary-container);
  outline-offset: 2px;
}
```
The border-color shift targets `.card` (the bordered element inside `ProjectCard`), not `.project-card-cell` itself (a positioning wrapper with no border of its own).

**Accessible name — `aria-label`, not left to native fallback (DD-48).** Without it, the anchor's computed accessible name would concatenate every descendant text node — chip tag + title + full description — for all 4 cards. Technically valid but needlessly verbose for a screen-reader user tabbing between 4 links back-to-back, where the title alone identifies each one. `aria-label={t(project.title)}` is a single JSX attribute on a plain native anchor — no JS, no custom keydown handling (AC-9's standing constraint holds).

**No conflict with `OPEN_GITHUB [ALL]`.** Confirmed in `FeaturedSystems.tsx`: that link is a sibling in `.featured-systems__heading`, entirely outside `.featured-systems__grid` — different link, different purpose, no nesting.

---

## CSS deltas (`home.css`)

Only the rules below change this revision; every other rule (`.section`, `.hero*`, `.site-header*`, `.connect*`, the shared full-height/scroll-snap rule) is carried forward verbatim from rev 10, not reproduced again.

**New:**
```css
.builder__facts a {
  color: var(--primary-container);
  text-decoration: underline;
}
```

**Featured Systems — full rewrite of the desktop grid mechanism, tablet/mobile simplified to a uniform (non-tiered) grid:**
```css
.featured-systems__heading {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}

.featured-systems__github {
  color: var(--primary-container);
  text-decoration: underline;
}

.project-card-cell {
  grid-column: 1 / -1;
}

@media (min-width: 768px) {
  /* Uniform 2-col tier below desktop — weight-based treemap sizing (AC-4)
     is desktop-only (DD-44); tablet/mobile treat every card equally,
     matching tablet.png/mobile.png (no size-tiered cards shown there). */
  .featured-systems__grid {
    grid-template-columns: 1fr 1fr;
  }

  .project-card-cell {
    grid-column: span 1;
  }
}

@media (min-width: 1024px) {
  /* Carried forward, unchanged (DD-29/DD-32): the grid's total height comes
     from the SECTION's own fixed height, not content. */
  .featured-systems > .container-max {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* NEW — the grid is no longer CSS Grid at this breakpoint. Children's
     positions/sizes come from the treemap function's output (--rect-*
     custom properties set inline per card), not grid-template-*. */
  .featured-systems__grid {
    flex: 1;
    min-height: 0;
    position: relative;
    display: block;
  }

  .project-card-cell {
    position: absolute;
    top: var(--rect-top);
    left: var(--rect-left);
    width: var(--rect-width);
    height: var(--rect-height);
    box-sizing: border-box;
    /* Reuses the existing desktop gutter token (24px) — half on each edge
       reproduces the same 24px total gap between adjacent cards this grid
       already used; no new pixel value introduced. */
    padding: calc(var(--spacing-gutter-desktop) / 2);
  }

  .featured-systems__grid .card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .featured-systems__grid .card__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* last-resort: a genuinely-too-long description
      scrolls within its own card rather than clipping silently */
  }

  .featured-systems__grid .project-card__image {
    flex: 1;
    min-height: 0;
    object-fit: cover;
  }
}

.project-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-card__image,
.project-card__glyph {
  display: block;
  margin-top: 16px;
}

.project-card__image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
```

**Removed, no longer needed:** the desktop `grid-template-columns: 7fr 5fr`, `.project-card-cell--large`/`--small` tier classes, `grid-template-rows: repeat(3, 1fr)`, and the CSS-Grid-specific `.project-card-cell { min-height: 0 }` fix — that gotcha (implicit grid-item `min-height: auto`) doesn't exist once these children are absolutely positioned instead of grid items.

**Unchanged, still present exactly as before:** `.builder` (background/flex/justify-content), `.builder > .container-max`, `.builder__image-wrap`, `.builder__image`, `.builder__content`, `.builder__facts` (list layout, gap, font), `.builder__quote`, `.builder__stats`, `.connect*`, `.site-header*`.

**New this revision (rev 12) — `.project-card-cell` becomes a link, needs a reset + hover/focus affordance:**
```css
.project-card-cell {
  grid-column: 1 / -1;
  color: inherit;
  text-decoration: none;
}

.project-card-cell:hover .card,
.project-card-cell:focus-visible .card {
  border-color: var(--primary-container);
}

.project-card-cell:focus-visible {
  outline: 2px solid var(--primary-container);
  outline-offset: 2px;
}
```
Every other Featured Systems rule above (the ≥768px 2-col grid, the ≥1024px `position: absolute` + `--rect-*` block) is unchanged — those rules already target `.project-card-cell` by class, which still matches now that the element is an `<a>` instead of a `<div>`.

## Mobile
N/A — no mobile layer (`PRODUCT.md` Mobile: "none — not planned").

## Infrastructure

**New dependencies:** none this revision.

**New static assets:** none. **Deleted static assets:** `apps/web/src/assets/projects/{aura-core,kinetic-ui,nebula-flux}.webp` (orphaned, see AC-4 above).

**`apps/web/index.html` changes:** none.

**Docker services:** none.

**CI changes:** none — existing `pnpm lint` / `pnpm type-check` / `pnpm test` / `apps/e2e` Playwright job pick up the edited files automatically via Turborepo's task graph. Per the Risks section's standing image-asset check, run `pnpm --filter @me/web build` before/after to confirm the 3 deleted `.webp` files actually drop out of the bundle.

## Cross-cutting Concerns

**Auth:** N/A — no auth in Phase 1 (`PRODUCT.md`).

**Validation:** N/A — no form, no user input on this route.

**Error handling:** Unchanged.

**Logging:** N/A.

**Accessibility:** New interactive element this revision — the `CURRENT_ROLE` company `<a>` — is a plain native anchor (no custom keydown/focus-trap, per AC-9's standing constraint) and inherits the same native `:focus-visible` treatment every other link on the page already gets. `target="_blank"` carries `rel="noopener noreferrer"` per AC-3's explicit text. Featured Systems' glyph-only cards introduce no new a11y surface — `aria-hidden="true"` on the SVG glyph is pre-existing, unchanged.

## Design decisions

- **DD-1 through DD-39:** unchanged, carried forward verbatim from rev 10 (see rev-10's own text, and earlier revisions before it, for the full history — not reproduced again here).

- **DD-40 — NEW (rev 11): Builder's role/specialization/philosophy/quote/stat content moves into a new local typed data module (`apps/web/src/data/builder.ts`), holding i18n key-path strings rather than resolved copy, mirroring `data/projects.ts`'s existing pattern (DD-14) exactly.** A future backend/admin producing this same shape could supply key paths (or, later, fully resolved strings) without any `Builder.tsx` rewrite. `Builder.tsx`'s two hand-copied `<Card>` stat blocks are replaced with `builderProfile.stats.map()`, mirroring `FeaturedSystems.tsx`'s existing `.map()`-over-array pattern.

- **DD-41 — NEW (rev 11): the `CURRENT_ROLE` fact splits into a translatable prefix i18n key (`builder.factRolePrefix`) and a literal (non-i18n) `company: { name, url }` field, joined in JSX around a real `<a target="_blank" rel="noopener noreferrer">`.** `company` is deliberately NOT an i18n key path — both locale files already carry the identical literal company name today, and a URL is never translated regardless. Styled lime + underline, matching `.featured-systems__github`'s existing "inline outbound link within body copy" precedent. A per-project GitHub-URL field on the Featured Systems `Project` type was considered and explicitly rejected — no bullet in AC-4 asks cards to link to their own repo.

- **DD-42 — NEW (rev 11), REPLACES an intermediate, rejected draft: card sizing is a recursive treemap (`apps/web/src/lib/treemap.ts`) computed in TypeScript at render time, not a fixed-tier CSS-class system.** An earlier draft this same revision proposed a `sizeForWeight` function (3 fixed weight thresholds → large/medium/small CSS classes) packed via `grid-auto-flow: dense` — its packing math was hand-verified only for the current 4-project dataset (superclean/backendTaskTracker/jUtils/wrapperPath) and would not automatically recompute for a re-curated list of 2, 3, 5, or 6 projects; the user explicitly rejected it for this reason. The treemap instead guarantees, by construction (area ratios telescope from root to leaf regardless of tree shape — see the AC-4 prose above for the full proof), that every project's rendered area is always exactly `total area × (its weight / sum of all weights currently in the list)` — for any N ≥ 1, with zero hardcoded thresholds or row/column counts. Sorting is internal to `treemap()` (stable, descending by weight) purely for a more legible visual grouping — not required for the area guarantee, which holds for any grouping.

- **DD-43 — NEW (rev 11): rendering uses CSS custom properties for absolute positioning, not literal inline `top`/`width`/etc. style props, and only takes effect at the existing `≥1024px` breakpoint.** `.featured-systems__grid` becomes `position: relative` (desktop only) and each `.project-card-cell` gets `position: absolute` with `top`/`left`/`width`/`height` driven by `--rect-*` custom properties set inline from `treemap()`'s output. Literal inline style props would apply at every viewport width (inline styles beat any external stylesheet rule without `!important`), fighting the tablet/mobile natural-height CSS Grid stacking this feature already relies on — the only fix would be a JS `matchMedia`/resize-listener breakpoint hook, which this codebase has never needed for any other responsive behavior (CONSTITUTION P1/P2). The gutter reuses `--spacing-gutter-desktop` (12px padding per edge = the existing 24px total gap, confirmed present in `packages/ui/src/tokens.css` — no new spacing value invented).

- **DD-44 — NEW (rev 11): below 1024px, the treemap does not apply — every card gets equal (uniform 2-col/1-col) CSS Grid treatment instead of a scaled-down tier system.** AC-13's full-height/scroll-snap mechanism (which the treemap exists to serve) is explicitly desktop-only; `tablet.png`/`mobile.png` show uniformly-sized stacked/2-col cards, not size-tiered ones; nothing in AC-8 asks for weight-derived sizing below desktop. Per this project's "no speculative features" rule, a smaller tablet/mobile tier system isn't invented where nothing requires it.

- **`ProjectCard`'s `size` prop is deleted, not reduced.** Sizing is now entirely a `FeaturedSystems.tsx`-owned wrapper concern; nothing in the functional spec asks for a reduced `size`-driven concern inside `ProjectCard` itself (e.g. font-scaling), so nothing is added.

- **CONSTITUTION.md gained P5 ("full-height, page-like sections"), added directly by the user this revision** — promotes AC-13's full-height/scroll-snap section pattern from a one-feature choice to a durable, project-wide structural rule, enforced by `/j-flow-review` going forward like the other 4 principles.

- **DD-45 — NEW (rev 12): the whole-card `<a>` is `FeaturedSystems.tsx`'s existing `.project-card-cell` wrapper (retagged from `<div>`), not a new `url` prop on `ProjectCard`.** That wrapper is already the positioned element (DD-42/43) — `position: absolute`/grid-item, both unconditionally blockified per the CSS Display spec — so retagging it needs zero new sizing CSS. Giving `ProjectCard` its own internal anchor would need a second, redundant fill-the-parent wrapper. `ProjectCard.tsx` is untouched this revision.

- **DD-46 — NEW (rev 12): `.project-card-cell` resets `color: inherit; text-decoration: none;`.** Confirmed by reading `typography.css` that `.text-headline-md`/`.text-body-md` set no `color` of their own — without the reset, the title/description would inherit the UA-default anchor color, and the UA-default underline would propagate across all descendant text.

- **DD-47 — NEW (rev 12): hover/focus affordance is `border-color: var(--primary-container)` on `.card` (borrowed from `input.css`'s existing focus precedent) plus the same `outline: 2px solid var(--primary-container); outline-offset: 2px` `:focus-visible` rule every other interactive element in this codebase (`.btn`, `.nav__link`, `.nav__toggle`, `LanguageToggle`) already defines independently — no global focus reset exists to hook into, and no new visual language is invented.**

- **DD-48 — NEW (rev 12): the anchor gets `aria-label={t(project.title)}`.** Native accessible-name computation would otherwise concatenate the chip tag + title + full description for all 4 cards — technically valid but needlessly verbose for a screen-reader user tabbing between them; the title alone is what identifies each card.

### AC-3 (revision 7) — Builder fixed-height rework — unchanged, carried forward verbatim (DD-28, DD-30)

### AC-4 / AC-13 (revision 7) — Featured Systems fixed-height rework — SUPERSEDED IN PART by rev 11 above (DD-42/43/44 replace the grid's own row/column mechanism; the section/container-max-level fixed-height mechanism, DD-29/DD-32, is unchanged)

### AC-13 (revision 7) — hard `height` cap, not `min-height` (DD-19 REVERSED) — unchanged, carried forward verbatim; **Connect's own centering rule (DD-31) is untouched by rev 10/11**

### AC-1 (revision 9) — wordmark rebrand + brand-click-to-Hero (DD-34) — unaffected by rev 10/11, carried forward verbatim

### AC-1 (revision 8) — nav label rename + `useActiveSection` mechanism (DD-25 REVISED) — unaffected by rev 10/11, carried forward verbatim

### AC-1 (fixed header, smooth scroll) — mechanism unchanged, carried forward verbatim (DD-8, DD-9, DD-2)

### AC-1 (centered nav, revision 3) — unchanged, carried forward verbatim (DD-12)

### AC-1 (revision 4/5) — full-bleed header, CONNECT.EXE removal, mobile hamburger disclosure — unchanged, carried forward verbatim (DD-17, DD-18)

### AC-5 / AC-6 (revision 8) — Connect: Challenges→Connect content swap, CtaBand merge/deletion — unchanged, carried forward verbatim (DD-33)

### AC-5 (revisions 9/10) — Footer merge, `<Section>`-bypass, full-bleed bottom-pinned footer — unchanged, carried forward verbatim (DD-35, DD-36, DD-38, DD-39)

### AC-11 — LanguageToggle — unchanged, carried forward verbatim

### AC-12 — Visual rhythm — unchanged, carried forward verbatim

### AC-8 — Responsive fidelity, tablet/mobile layout structure — unchanged, carried forward verbatim except Featured Systems' own tablet/mobile CSS simplification (DD-44) noted above

## Testing Strategy

**Unit/component tests (Vitest + React Testing Library) — unchanged conventions, carried forward verbatim:** `lib/test-i18n.ts`, the "query text via the real `en` JSON, not a re-typed literal" convention, `packages/ui/src/components/{LanguageToggle,Nav}.test.tsx`, `apps/web/src/hooks/useActiveSection.test.ts`.

**`apps/web/src/lib/treemap.test.ts` (new, AC-4):**
```ts
import { describe, it, expect } from 'vitest';
import { treemap } from './treemap';

const area = (r: { width: number; height: number }) => r.width * r.height;
const totalArea = (rects: { width: number; height: number }[]) => rects.reduce((sum, r) => sum + area(r), 0);

describe('treemap', () => {
  it('N=1 returns the entire container', () => {
    expect(treemap([{ weight: 42 }])).toEqual([{ top: 0, left: 0, width: 100, height: 100 }]);
  });

  it.each([2, 3, 5])('gives equal weights equal area, for N=%i', (n) => {
    const rects = treemap(Array.from({ length: n }, () => ({ weight: 1 })));
    const expected = 10000 / n;
    rects.forEach((r) => expect(area(r)).toBeCloseTo(expected, 5));
  });

  it('gives a dominant weight a proportionally larger area', () => {
    const [big, small1, small2] = treemap([{ weight: 800 }, { weight: 100 }, { weight: 100 }]);
    expect(area(big)).toBeCloseTo(8000, 5);
    expect(area(small1)).toBeCloseTo(1000, 5);
    expect(area(small2)).toBeCloseTo(1000, 5);
  });

  it.each([2, 3, 5])('always tiles the full container exactly, no gaps, for N=%i', (n) => {
    const rects = treemap(Array.from({ length: n }, (_, i) => ({ weight: i + 1 })));
    expect(totalArea(rects)).toBeCloseTo(10000, 5);
  });

  it('never produces negative or out-of-bounds coordinates', () => {
    const rects = treemap([{ weight: 800 }, { weight: 450 }, { weight: 200 }, { weight: 200 }]);
    rects.forEach((r) => {
      expect(r.top).toBeGreaterThanOrEqual(0);
      expect(r.left).toBeGreaterThanOrEqual(0);
      expect(r.top + r.height).toBeLessThanOrEqual(100.0001);
      expect(r.left + r.width).toBeLessThanOrEqual(100.0001);
    });
  });

  it('returns rects in input order, not internal sorted order', () => {
    const [lowWeightRect, highWeightRect] = treemap([{ weight: 10 }, { weight: 800 }]);
    expect(area(highWeightRect)).toBeGreaterThan(area(lowWeightRect));
  });
});
```

**`apps/web/src/data/projects.test.ts`** — deleted (its only subject, `sortByWeightDesc`, is removed).

**`apps/web/src/components/home/ProjectCard.test.tsx`** — the two `size`-class tests removed; image/glyph-fallback tests unaffected.

**`apps/web/src/pages/HomePage.test.tsx` (edit, AC-3 + AC-4):**
```ts
describe('AC-3 — About/Builder', () => {
  it('renders the builder image, facts, pull-quote and two stat cards', () => {
    renderHomePage();
    const image = screen.getByRole('img', { name: en.builder.imageAlt });
    expect(image).toBeInTheDocument();
    expect(screen.getByText(new RegExp(en.builder.factRolePrefix))).toBeInTheDocument(); // NEW, rev 11
    expect(screen.getByText(en.builder.factSpecialization)).toBeInTheDocument();
    expect(screen.getByText(en.builder.factPhilosophy)).toBeInTheDocument();
    expect(screen.getByText(en.builder.quote)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.builder.stat1Title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.builder.stat2Title })).toBeInTheDocument();
  });

  it('renders the Fz Sports company name as a new-tab link to fzsports.com', () => { // NEW, rev 11
    renderHomePage();
    const link = screen.getByRole('link', { name: 'Fz Sports' });
    expect(link).toHaveAttribute('href', 'https://www.fzsports.com/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('AC-4 — Featured Systems', () => {
  it('renders the OPEN_GITHUB link and exactly 4 project cards', () => {
    renderHomePage();
    expect(screen.getByRole('link', { name: en.featuredSystems.githubLink })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.featuredSystems.superclean.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.featuredSystems.backendTaskTracker.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.featuredSystems.jUtils.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: en.featuredSystems.wrapperPath.title })).toBeInTheDocument();
  });

  it('gives the highest-weight project (superclean) a larger computed area than the lowest-weight ones', () => {
    renderHomePage();
    const area = (el: Element) => {
      const style = (el as HTMLElement).style;
      return parseFloat(style.getPropertyValue('--rect-width')) * parseFloat(style.getPropertyValue('--rect-height'));
    };
    const bigCell = screen.getByRole('heading', { name: en.featuredSystems.superclean.title }).closest('.project-card-cell')!;
    const smallCell = screen.getByRole('heading', { name: en.featuredSystems.jUtils.title }).closest('.project-card-cell')!;
    expect(area(bigCell)).toBeGreaterThan(area(smallCell));
  });

  it('equal-weight projects (j-utils, wrapper-path) get equal computed area', () => {
    renderHomePage();
    const area = (el: Element) => {
      const style = (el as HTMLElement).style;
      return parseFloat(style.getPropertyValue('--rect-width')) * parseFloat(style.getPropertyValue('--rect-height'));
    };
    const cellA = screen.getByRole('heading', { name: en.featuredSystems.jUtils.title }).closest('.project-card-cell')!;
    const cellB = screen.getByRole('heading', { name: en.featuredSystems.wrapperPath.title }).closest('.project-card-cell')!;
    expect(area(cellA)).toBeCloseTo(area(cellB), 5);
  });
});
```
No other `describe` block in this file changes — AC-1, AC-2, AC-5, AC-9, AC-13 tests are unaffected.

**Rev 12 addition to the `AC-4 — Featured Systems` describe block:**
```ts
it('each project card is a link to its own url, opening in a new tab', () => {
  renderHomePage();
  const link = screen.getByRole('link', { name: en.featuredSystems.superclean.title });
  expect(link).toHaveAttribute('href', 'https://github.com/jotafierro/superclean');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});
```
The two existing computed-area tests (`.closest('.project-card-cell')`) are unaffected — class-selector lookups work identically whether the element is a `div` or an `a`. `ProjectCard.test.tsx`/`treemap.test.ts` are unchanged this revision.

**Playwright E2E (`apps/e2e/tests/`):** unchanged convention — deferred to `/j-flow-qa`. Added to the future `home.spec.ts`'s scope this revision:
- At ≥1024px, the Featured Systems grid visually renders proportional to weight (superclean visibly larger than the other 3); section total height still measures exactly `100vh - var(--site-header-height)`.
- Resize test: temporarily edit `projects.ts` to 2 or 3 entries locally and confirm the grid recomputes with no gaps/overlap (manual verification during `/j-flow-qa`, not necessarily an automated Playwright case — noted for the reviewer).

**Storybook:** unchanged — no `packages/ui` component's public API changed this revision.

**NestJS E2E:** N/A — no backend.

**Flutter integration:** N/A — no mobile.
