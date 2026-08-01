# Gate Context — 04-design-polish

> Append-only. Each phase adds one block. Subsequent skills read this file first.

[FUNCTIONAL SPEC] approved 2026-07-25
  → key decisions: build `/` landing route matching `docs/mockups/web/me.png` (10 ACs: nav, hero, about/builder, featured systems, challenges, CTA band, footer, responsive, a11y, icon/favicon); form UX deferred to Phase 2

[TECHNICAL SPEC] approved 2026-07-25 [stale]
  → architecture: pure UI composition in `apps/web` on top of existing `packages/ui` primitives (Button/Card/Chip/Nav) — no new design-system primitives; `BrowserRouter` introduced since `Nav` requires Router context
  → patterns: `Section`/`ProjectCard` reused wrappers, body-only `Card` usage, plain `index.html` SEO meta tags, hardcoded copy (no i18n), lazy-loaded/dimensioned images for CLS safety

[TASK PLAN] approved 2026-07-25 [stale]
  → 11 tasks across 1 layer (ui), 10 ACs covered
  → e2e (home.spec.ts new, health.spec.ts update) explicitly documented in review-guide.md, deferred to /j-flow-qa per standard flow (user confirmed)

[FUNCTIONAL SPEC] updated 2026-07-25
  → added AC-11 (language selector, full en/es translation, reverses DD-4); extended AC-1 (fixed header, 03_LOGS → Challenges, smooth-scroll w/ offset)
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — first 11-task ui build (uncommitted) also needs rework for these ACs before commit

[TECHNICAL SPEC] approved 2026-07-25 (revision 2) [stale]
  → architecture: sticky header (DD-8) + scrollIntoView hash-trigger (DD-9, NavLink doesn't natively scroll under plain BrowserRouter) + Suspense-boundary i18n consumption (DD-10) — everything else carried forward from revision 1
  → patterns: full home.json en/es namespace (per-component key plan), native <select> LanguageSelector using i18n.changeLanguage(), DD-4 reversed (i18n no longer deferred)
  → label tweak: 3rd nav item renamed 03_LOGS → 03_CHALLENGES (es: 03_DESAFÍOS) across functional-spec/technical-spec/tasks/review docs

[TASK PLAN] approved 2026-07-25 (revision 2) [stale]
  → 14 tasks across 1 layer (ui) — added ui-12 LanguageSelector, ui-13 i18n foundation; ui-1/3/4-10 extended for AC-11 copy + AC-1 sticky/scroll. 11 ACs covered

[FUNCTIONAL SPEC] updated 2026-07-26 (revision 3)
  → added AC-12 (spacing rhythm + dot-grid background); extended AC-1 (centered nav), AC-3 (bordered image frame), AC-4 (data-driven projects w/ weight-based sizing), AC-5 (framed section), AC-11 (LanguageToggle redesign: globe+EN/ES toggle, promoted to packages/ui w/ Storybook story)
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — second-pass ui build (uncommitted) also needs rework for these ACs before commit

[TECHNICAL SPEC] approved 2026-07-26 (revision 3) [stale]
  → architecture: nav centering fixed inside packages/ui's Nav (DD-12, 3-col grid) — a primitive bugfix, not app-local; LanguageToggle promoted to packages/ui (DD-11 revised) as 2 native aria-pressed buttons, not ARIA radiogroup (avoids AC-9 custom-keydown ban)
  → patterns: borders use --secondary-container per DESIGN.md's elevated-panel token (DD-13); Featured Systems data-driven via apps/web/src/data/projects.ts holding i18n key paths (DD-14), weight stable-sort for large/small slot; dot-grid via CSS radial-gradient, zero assets (DD-15); section rhythm 64/128px (DD-16)

[TASK PLAN] approved 2026-07-26 (revision 3) [stale]
  → 16 tasks across 1 layer (ui) — added ui-14 (packages/ui LanguageToggle), ui-15 (packages/ui Nav centering fix); ui-3/5/6/7/10 extended for borders, data-driven projects, dot-grid. 12 ACs covered

[FUNCTIONAL SPEC] updated 2026-07-26 (revision 4)
  → removed CONNECT.EXE CTA entirely; header goes full-bleed (no container-max clamp); added AC-13 (full-height scroll-snap sections for Builder/FeaturedSystems/Challenges, like separate pages); tightened AC-12 spacing bullet to match mockup measured proportions
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — third-pass ui build (uncommitted) also needs rework

[TECHNICAL SPEC] approved 2026-07-26 (revision 4) [stale]
  → architecture: header full-bleed via new .site-header__inner (no max-width), CONNECT.EXE JSX deleted outright (DD-17); scroll-snap-type: y proximity on html, not mandatory — avoids trapping scroll through non-target Hero/CtaBand/Footer (DD-18)
  → patterns: root-caused spacing mismatch to hero-internal rhythm never touched across 2 prior passes (headline→subcopy 16→40px, subcopy→CTA 32→64px, DD-16 revised); shared .section--snap class for 3 full-height sections, min-height not height (DD-19)

[TASK PLAN] approved 2026-07-26 (revision 4) [stale]
  → 16 tasks across 1 layer (ui) — ui-3 now removes CONNECT.EXE entirely; ui-1 adds scroll-snap-type; ui-5/6/7 mark section--snap; ui-10 owns full-bleed header CSS + re-measured hero spacing + shared .section--snap rule. 13 ACs covered

[FUNCTIONAL SPEC] updated 2026-07-26 (revision 5)
  → new mockups: full.png (was me.png, content source of truth), tablet.png, mobile.png (layout-only refs — supersede DD-3's "no tablet mockup" assumption); mobile-first rebuild, existing copy unchanged
  → AC-1: mobile nav collapses to hamburger toggle; AC-13: full-height/scroll-snap scoped to desktop only (avoids mobile 100vh bug); dependency cleanup: remove unused tailwindcss/zod/zustand (confirmed zero refs)
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — fourth-pass ui build (uncommitted) also needs rework

[TECHNICAL SPEC] approved 2026-07-26 (revision 5) [stale]
  → architecture: mobile hamburger nav via native <details>/<summary> inside packages/ui's Nav (display: contents unwrap keeps DD-12 centering untouched ≥768px, zero JS); reconciled user's manual nav.css width:100% edit as required/correct complement to DD-17
  → patterns: Featured Systems tablet 2-col tier (base rule already covers --large, DD-21); Builder breakpoint 1024→768 (DD-22, root-cause single-number fix); .section--snap gated to existing 1024px query (DD-23); tailwindcss/zod/zustand removed via single pnpm remove, confirmed zero refs (DD-24); DD-3 explicitly superseded

[TASK PLAN] approved 2026-07-26 (revision 5) [stale]
  → 17 tasks across 1 layer (ui) — added ui-16 (mobile hamburger nav), ui-17 (dependency removal); ui-3/5/6/10 extended for tablet/mobile breakpoints. 13 ACs covered

  ⚠ smoke check ui — build-time fix applied before commit: nav__disclosure::details-content unwrap bug (LanguageToggle dropped to its own row at ≥768px) — fixed and verified empirically (see technical-spec.md's "Build-time finding" note under AC-1 rev-5 CSS deltas)
  ⚠ DX fix applied (unrelated to any AC): added packages/ui/src/vite-env.d.ts (ambient *.css module declarations) — resolved editor-only TS2882 false positive; pnpm --filter @me/ui type-check already passed clean before and after

[FUNCTIONAL SPEC] updated 2026-07-27 (revision 6)
  → AC-1: nav gets scroll-tracked active-section underline indicator with slide/resize animation — reverses DD-7's earlier "no scroll-spy" stance (documented, not silent); mobile collapsed menu keeps static active-state, no slide
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — fifth-pass ui build (uncommitted, includes the details-content fix above) also needs rework
  → mid-revision: found + reconciled undocumented 4th nav link (00_INIT/#init → Hero) — user confirmed keep it, formally added to AC-1 (nav links, scroll target, underline tracking)
  ✓ smoke check ui 2026-07-27 — ACs confirmed: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10, AC-11, AC-12, AC-13 (+ dependency-removal check)

[BUILD] completed 2026-07-27
  → layers: ui ✓ (revisions 2–6 squashed into 2 commits: docs 64856be, feat b80b26c; plus unrelated chore 7b55334 dep/Storybook maintenance, fix 9c77b43 vite-env.d.ts)
  ⚠ post-build fixes applied: Hero vertical centering + included in full-height snap set (57c5874); Builder single outer frame, cover image, dev-focused philosophy copy (d7ff745)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 7)
  → AC-13: full-height sections hard-capped at viewport height (was min-height, could grow taller) — content must fill exactly, no overflow into next section; last-resort internal scroll only if genuinely too short
  → AC-3: Builder's image/text columns match height via object-fit:cover; text column vertically centered within that shared height (no dead space)
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — build code needs rework (fixed-height layout for Builder + Featured Systems, remove stale img width/height attrs driving unwanted aspect-ratio)

[TECHNICAL SPEC] approved 2026-07-28 (revision 7)
  → architecture: DD-19 REVERSED (min-height → hard height cap); Builder image taken out of grid content-sizing via position:absolute (root cause: leftover width/height attrs implicitly set aspect-ratio, won by grid's auto-sizing pass before stretch ran); Featured Systems grid-template-rows: repeat(3,1fr) divides fixed height evenly
  → patterns: per-card overflow-y:auto fallback for Featured Systems (real risk, assessed with numbers — ~200px/row budget at 900px viewport); Challenges gap found+fixed (never had centering, old min-height design mostly hid it); uniform overflow-y:auto on shared .section--snap rule as last-resort fallback

[TASK PLAN] approved 2026-07-28 (revision 7)
  → same 19 tasks, retargeted — ui-5 removes root-cause width/height attrs; ui-10 owns the bulk of the fixed-height rework. No new tasks (pure CSS/JSX-attribute fix). 13 ACs covered
  ⚠ smoke check ui — build-time fix beyond spec: CSS Grid's implicit min-height:auto on grid items (same gotcha as flexbox min-size auto, applied to .project-card-cell) was forcing the large card's 3 spanned rows to ~1300px instead of dividing the fixed height evenly — fixed with one min-height:0 rule, ponytail-commented
  ✓ smoke check ui 2026-07-28 — ACs confirmed: AC-3, AC-5, AC-13 re-verified (measured 828px exactly at 1440×900 for all 4 full-height sections; Builder columns match at 634px each; Featured Systems rows ~138px each)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 8)
  → AC-5 repurposed: Challenges/Desafíos → Connect (bordered-box CTA card, reuses CtaBand's copy); AC-6 (CtaBand) marked REMOVED — merged into AC-5, avoids duplicate back-to-back CTAs
  → AC-1: nav renamed 03_CHALLENGES → 03_CONNECT throughout (label, scroll target, underline tracking, mobile menu); challenges/stats content deferred, possibly folded into Featured Systems in a future feature
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale
  ⚠ bug fix (found via user report, not a scope change): useActiveSection's IntersectionObserver-based active-section detection could silently stop delivering callbacks under main-thread contention, leaving the nav underline stuck one section behind after a fast first→last nav-link click. Root-caused via CDP CPU throttling (reproduced 100% at 6x throttle, 0% at native speed) — replaced with a scroll/resize-driven rAF-throttled getBoundingClientRect() computation (no observer staleness window). Added apps/e2e/tests/nav-underline.spec.ts (fails on old code, passes on fix) — first real Playwright e2e coverage for this feature, previously deferred across revisions 1–7 to /j-flow-qa
  → will fold into technical-spec.md's next revision (DD update) alongside the Connect rename

[TECHNICAL SPEC] approved 2026-07-28 (revision 8) [stale]
  → architecture: Challenges.tsx renamed to Connect.tsx (not edited in place — misleading filename otherwise); CtaBand.tsx deleted; DD-25 REVISED to describe the actual scroll/rAF/getBoundingClientRect mechanism (was stale IntersectionObserver prose)
  → patterns: ctaBand.* i18n keys renamed to connect.* (reused as-is, zero new translation); challenges.* keys deleted entirely (dead config, not kept "just in case"); .challenges/.cta-band CSS renamed/deleted accordingly

[TASK PLAN] approved 2026-07-28 (revision 8) [stale]
  → 18 tasks across 1 layer (ui) — removed ui-8 (CtaBand, deleted), merged into ui-7 (now Connect). All ACs covered (AC-6 no longer exists)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 9)
  → AC-1: wordmark JOTA_FIERRO → jotafierro.me; brand logo/wordmark click now scrolls to Hero (#init)
  → AC-5: Connect absorbs former Footer's brand/year + GitHub/LinkedIn/Email links (visible without scrolling past the last nav destination); AC-7 marked REMOVED (merged into AC-5) — tagline dropped entirely, not relocated; Footer.tsx deleted
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale

[TECHNICAL SPEC] approved 2026-07-28 (revision 9) [stale]
  → architecture: brand wrapped in a plain <a href="#init"> (not NavLink) — same pattern as Hero's own CTAs, native scroll, no underline/aria-current (nothing asked for it); Connect.tsx restructured into .connect__card + nested <footer className="connect__footer">, justify-content:center treats both as one stacked block
  → ⚠ real a11y finding: <footer> nested inside <section>/<main> loses its implicit contentinfo role per ARIA-in-HTML spec — page now has zero contentinfo landmarks; kept the <footer> tag anyway (a <div> wouldn't restore it either), added an explicit regression test. AC-9's "footer landmark" clause is superseded by AC-5/AC-7's more specific instruction; user confirmed accepting this trade-off

[TASK PLAN] approved 2026-07-28 (revision 9) [stale]
  → 17 tasks across 1 layer (ui) — removed ui-9 (Footer, deleted), merged into ui-7 (Connect). AC-7 no longer in ac_coverage (removed, same treatment as AC-6)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 10)
  → AC-5: added subtitle copy between headline and email CTA; footer row now spans full viewport width (edge-to-edge like header) instead of clamped to the CTA card's box, stays non-fixed
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — Connect.tsx must stop using the shared Section wrapper to let footer break out of container-max's width cap

[TECHNICAL SPEC] approved 2026-07-28 (revision 10) [stale]
  → architecture: Connect.tsx hand-rolls its own <section> (bypasses shared Section component — confirmed no escape hatch exists, single-consumer need, YAGNI to add a prop); footer becomes a sibling of container-max instead of nested inside it (DD-38)
  → patterns: footer full-bleed, no inner cap — matches header/.nav's existing precedent (already lets brand/toggle drift to edges at ultra-wide viewports, DD-39); subtitle styled like .hero__subcopy minus the left-border

[TASK PLAN] approved 2026-07-28 (revision 10) [stale]
  → same 17 tasks — ui-7/ui-10 retargeted for subtitle + full-bleed footer + hand-rolled section. No new tasks needed

[TECHNICAL SPEC] approved 2026-07-27 (revision 6) [stale]
  → architecture: scroll-spy via IntersectionObserver hook (useActiveSection) in apps/web, feeding new activeTo? prop into packages/ui's Nav; DD-7 REVERSED (was: no scroll-spy, nothing asked for it)
  → patterns: single measured <span> underline, 200ms CSS transition gated behind prefers-reduced-motion (first in codebase), hidden <768px in favor of existing color-only aria-current; scroll-spy observes all 4 nav destinations (init/the-builder/featured-systems/challenges)

[TASK PLAN] approved 2026-07-27 (revision 6) [stale]
  → 19 tasks across 1 layer (ui) — added ui-18 (useActiveSection hook), ui-19 (Nav underline indicator); ui-3/ui-4 extended for 00_INIT/Hero + wiring. 13 ACs covered

  ✓ smoke check ui (revision 10 delta) 2026-07-28 — ACs confirmed: AC-5
    (Connect subtitle + full-bleed bottom-pinned footer; one build-loop fix
    applied — footer bottom-pin, verified via headless DOM check + screenshot)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 11)
  → AC-3: Builder's "Fz Sports" company name becomes a link to https://www.fzsports.com/; role/specialization/philosophy/quote/stats content moves to a local typed data module (mirrors AC-4's data pattern), API-ready shape
  → AC-4: real public GitHub repos (github.com/jotafierro) replace placeholder projects (superclean/r-backend-task-tracker-cli/j-utils/wrapper-path); sizing mechanism redesigned from "1 large slot + rest small" to a 3-tier weight system (Large ≥700 2×2, Medium 300-699 2×1, Small <300 1×1), grid-auto-flow: dense packing
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — new apps/web/src/data/builder.ts data module, FeaturedSystems grid rework, projects.ts data swap

[TECHNICAL SPEC] approved 2026-07-28 (revision 11) [stale]
  → architecture: Builder content moves to a new local data module (data/builder.ts, DD-40), CURRENT_ROLE company name split into a real <a> link (DD-41); Featured Systems sizing redesigned to a recursive treemap computed in TS at render time (DD-42), rendered via CSS custom properties + absolute positioning at >=1024px only (DD-43), tablet/mobile keep a uniform non-tiered grid (DD-44)
  → two-pass design: an intermediate 3-tier CSS-class draft (hand-verified only for the current 4-project dataset) was rejected by the user for not generalizing to a re-curated project count — treemap replaces it, guarantees exact area-proportionality for any N by construction
  → CONSTITUTION.md gained P5 (full-height, page-like sections) at the user's request, promoting AC-13's mechanism to a durable project-wide principle

[TASK PLAN] approved 2026-07-28 (revision 11) [stale]
  → same 17 tasks, retargeted — ui-5 adds data/builder.ts (DD-40/41); ui-6
    reworked for real repo data + lib/treemap.ts (drops sortByWeightDesc,
    projects.test.ts, 3 placeholder .webp assets, ProjectCard size prop);
    ui-10 rewrites Featured Systems CSS for --rect-* custom props (DD-42/43/44).
    No new tasks needed. 11 ACs covered

  ✓ smoke check ui (revision 11) 2026-07-28 — ACs confirmed: AC-3, AC-4
    (Builder data module + Fz Sports link; treemap Featured Systems sizing —
    verified against the spec's hand-worked 4-project example exactly, plus
    a manual N=5 dynamic-recompute check: total area exact, no gaps, no
    manual CSS needed)

[FUNCTIONAL SPEC] updated 2026-07-28 (revision 12)
  → AC-4: corrected a stale bullet (still described the rejected 3-tier CSS
    system instead of the approved treemap — functional spec was never
    synced when the technical spec pivoted mid-revision-11); added `url`
    field per project (real GitHub links for the 4 current repos) — clicking
    anywhere on a card navigates to its url, opens in a new tab
  → marks [TECHNICAL SPEC] and [TASK PLAN] stale — ProjectCard/FeaturedSystems
    need the whole-card-as-link treatment

[TECHNICAL SPEC] approved 2026-07-28 (revision 12)
  → architecture: whole-card click-to-new-tab via retagging FeaturedSystems.tsx's
    existing .project-card-cell wrapper from <div> to <a> (DD-45, no new
    ProjectCard prop needed — that wrapper is already the positioned element);
    Project gains required url field with the 4 real GitHub URLs
  → patterns: color/text-decoration reset (DD-46) since typography.css sets no
    color; hover/focus reuses input.css's border-color precedent + the
    outline:2px pattern every other interactive element already repeats
    independently (DD-47); aria-label for a concise accessible name (DD-48)

[TASK PLAN] approved 2026-07-28 (revision 12)
  → same 17 tasks, retargeted — ui-6 adds url field + div->a retag (DD-45);
    ui-10 adds the click-affordance CSS + HomePage.test.tsx link test
    (DD-46/47). No new tasks needed. 11 ACs covered

  ✓ smoke check ui (revision 12) 2026-07-29 — ACs confirmed: AC-4 (clickable
    project cards). Note: a build-time artifact briefly modified es/home.json
    outside this revision's scope (unrelated UTF-8 accent drift on 2 unrelated
    lines, one a regression) — reverted to HEAD before commit, confirmed no
    scope creep, all 42 tests still pass

[BUILD] completed 2026-07-29
  → layers: ui ✓ (revisions 11-12 built and committed: Builder data module +
    Fz Sports link, treemap-based Featured Systems with real project data,
    clickable cards)

[QA] green 2026-07-29
  → lint/unit/e2e/storybook-build all pass; home.spec.ts written (7 tests,
    was owed since revision 1's review-guide); health.spec.ts's stale
    substring check retired; manual checklist carried forward green from
    build-time confirmation (11/11 AC rows)

[REVIEW] approved 2026-07-29
  → constitution: ✓ 5 principles checked
  → ponytail: 3 findings — 2 correctly flagged real dead CSS (fixed), 1 (image/imageAlt fields) evaluated and rejected as spec-mandated, 1 (treemap "over-generalized") evaluated and rejected as the explicitly-requested design, 1 (Nav.tsx aria-current) noted as a future cleanup candidate, not blocking
  → 3 minor findings resolved (dead .site-header/.site-header__logo/.app-title CSS); 0 critical, 0 major
