# Review Findings — 07-brand-alignment
Date: 2026-10-08

## Constitution check

P1–P6 checked by the orchestrator before this review: all pass. Nothing found here changes that. There is no new dependency. `quarter.ts`/`quarter.test.ts` are deleted, and `LanguageDetector` stays bundled as before. No CSS or component was added, and the work stays web-only.

## Critical (must fix before approval)

None found.

## Major (should fix)

- `apps/web/src/lib/i18n.ts:42`: `detection.caches` is still `['localStorage']`. technical-spec §1 and DD-2 require `caches: []`, and tasks.json ui-1 names it in its title. i18next calls `languageDetector.cacheUserLanguage(l)` from `setLng` even when `lng` is explicit, so every visit writes `i18nextLng=es` to localStorage. That has two effects. First, a returning visitor's stored `en` gets overwritten with `es`, so the "re-enable English later, no other change" path in the spec's Edge cases quietly loses those visitors' preference. Second, `review/web.md` step 1.4 ("no `i18nextLng` written to localStorage on a clean profile") is marked passing but the code does not meet it. The rendered output still meets AC-1 (Spanish is forced by `lng: 'es'`), so this is a spec deviation, not a user-visible bug. The comment at `apps/web/src/lib/i18n.ts:9` also has the instruction backwards ("restore `caches: []`"). **Fix:** set `caches: []` at line 42. Rewrite line 9 to say "remove `lng`, restore `caches: ['localStorage']`". Close the test gap that let this through: in `apps/web/src/lib/i18n.test.ts`, after `import('./i18n')` (line 43), add `expect(localStorage.getItem('i18nextLng')).toBe('en')`, meaning the stored value is left untouched. Optionally add the same check in `apps/e2e/tests/home.spec.ts` after line 106: `expect(await page.evaluate(() => localStorage.getItem('i18nextLng'))).toBe('en')`.

## Minor (optional)

- `apps/web/src/lib/error-boundary.test.tsx:3`: `import './test-i18n'` has no effect on this test. `ErrorBoundary` reads the production singleton (`import i18n from './i18n'` in `error-boundary.tsx:2`), not `testI18n`. The `es.error.title` assertion passes because production i18n is forced to `es`. That is the right behavior to test, but the import suggests otherwise. Drop the import, or change the comment and title to say it runs against the production instance.
- `apps/web/src/lib/i18n.test.ts:47`: `localStorage.removeItem('i18nextLng')` only runs if both assertions pass. If the test fails, the stored `en` stays in jsdom storage for the rest of the file. Move the cleanup to `afterEach` or a `try/finally`.
- `apps/web/public/llms.txt:8`: "Los artefactos del proceso son el punto" is a calque of "are the point". In Spanish it reads off ("lo esencial" or "lo importante" is natural). "en el repositorio de abajo" could read "en el repositorio enlazado abajo". The text follows technical-spec §4 word for word, so this is a copy polish, not a conformance issue.
- `apps/web/src/locales/en/home.json:30`: "I train basketball" is ambiguous in English (it reads as coaching). The dormant locale would read better as "I play basketball" or "Basketball training". It is not user-visible today.

## Category notes (clean)

- **AC conformance (code, not just tests):**
  - AC-1: the code meets it. `lng: 'es'` is in `i18n.ts:34`, `<html lang="es">` is in `index.html:2`, and the `languageChanged` handler syncs `lang` at runtime. The en locale and the detector are still in place. The only issue is the caching deviation above.
  - AC-2: `Header.tsx` no longer passes `cta`, and `Nav.tsx:81` renders `nav__cta` only when `cta` is set. `LanguageToggle` is untouched in `packages/ui`.
  - AC-3: `Hero.tsx` keeps the prefix/highlight/suffix structure, and the es copy matches the spec table.
  - AC-4: `Builder.tsx:40` has the pillars `<li>`, `data/builder.ts` has `pillarsKey`, and the bio is covered by the role, `factHuman` and `quote`.
  - AC-5: the headline is `HABLEMOS`, the subtitle is static, and `nextQuarter` is gone. The quarter files are deleted, and type-check passing confirms nothing else imports them.
  - AC-6: the YouTube `<li>` is 3rd of 4, has `target="_blank"` and `rel="noopener noreferrer"`, and has no `aria-label`, so the accessible name equals the visible text. Nothing was added next to the email CTA.
  - AC-7: `index.html`, `llms.txt` and `manifest.json` match technical-spec §2–§4 word for word.
  - AC-8: no hardcoded strings were added. The ErrorBoundary copy is now in i18n.
- **Spec conformance:** DD-1 and DD-3 through DD-7 are implemented as written. Every file in files-to-touch was changed. `CLAUDE.md` now points to `apps/web/src/locales/`. `.specs/_system/landing-page.md` is deferred to `/j-flow-finish` as the spec says. The only DD-2 deviation is the Major above.
- **Speculative code:** none found. Every change traces to a DD or AC, and nothing extra was added.
- **Leftovers:** no remaining `quarter`/`nextQuarter` import. No `LanguageToggle`, `i18n.language` or `changeLanguage` remains in `apps/web` non-test code. `header.languageLabel` is unused by the UI and kept on purpose (spec table). `header.connect` is referenced only by a test, but that predates this feature and is out of scope. en/es key parity holds (60/60 per QA).
- **Tests:**
  - The unit and e2e assertions use exact rendered strings from `es` (not keys), the footer order is asserted from the DOM, and the YouTube `href`/`target`/`rel` are asserted in both suites.
  - The forced-es unit test uses `vi.resetModules()`, so it initializes a fresh i18next singleton and is not vacuous. jsdom's `navigator.language` is `en-US`, so it also covers an English browser.
  - The e2e forced-es test pairs the `lang` check with the hero copy, so it would still fail even though `lang="es"` is set statically.
  - The mobile test opens the disclosure and checks for 4 visible links, one `aria-current`, and that `.language-toggle` (the real class from `LanguageToggle.tsx:16`) is absent.
  - The one real gap is the missing localStorage assertion, covered in the Major above.
- **a11y:** `lang="es"` is set both statically and at runtime. The YouTube link meets label-in-name, and the new-tab link uses `rel="noopener noreferrer"`. The toggle is not in the DOM, so it cannot take focus.
- **Content rules:** I read every user-visible and machine-readable file in scope: `index.html` (title, description, og), `llms.txt`, `manifest.json`, `robots.txt`, `sitemap.xml`, and both locales. None of them mention UBB or a degree, daughters' names or ages, money figures, a service, consulting or availability offer, Buy Me a Coffee, or a newsletter. "Papá de dos hijas" / "two daughters" is the approved level of detail.
- **Spanish copy:** accents are correct throughout ("CÓDIGO", "publiqué", "Escríbeme", "salió", "Ingeniería", "construcción", "básquetbol"). `hero.status` "LOGICA" is pre-existing and kept by the spec. The es and en meanings match apart from the en nit above.
- **Security:** no inline scripts were added (`index.html` still loads only `/src/main.tsx`). The CSP in `apps/web/vercel.json` is unaffected, because the YouTube link is a top-level navigation, not a fetched resource. No secrets appear in `review-guide.md` or `review/web.md`.

## Verdict

**approved** (2026-10-09, after fixes in 9f4f1de). Initial verdict was changes-requested: one Major (DD-2 `caches: []` not applied, plus the missing test assertion that would have caught it). The fix is a one-line config change, a comment correction and one added assertion. Re-run `/j-flow-qa` (unit tests only), then come back for approval.

Resolution: all 1 Major + 3 Minor code findings fixed, plus the en-locale wording Minor; unit, e2e, lint, type-check and build re-verified green.
