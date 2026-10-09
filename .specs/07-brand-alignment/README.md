# Brand alignment

**Slug:** 07-brand-alignment
**Branch:** main (trunk-based, no feature branch)
**PR:** none (solo repo, no pull requests)
**Merged:** 2026-10-09 (commits 155c3cb, 9f4f1de)

## Summary

Aligned jotafierro.me with the brand positioning (rumbo B-036): Spanish is the only visible language, the language toggle is hidden (EN infra kept dormant), Hero/Builder/Connect copy states the positioning and three content pillars, the Connect section no longer advertises engineering work (contract clause 8.1), and the footer links the YouTube channel. Copy and wiring only, no redesign.

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Spanish is the only language (forced, `lang=es`, stored `en` ignored) | ✓ |
| AC-2 | Language toggle hidden on desktop and mobile menu | ✓ |
| AC-3 | Hero states the positioning, chip and CTAs unchanged | ✓ |
| AC-4 | Builder bio reflects the published bio, pillars line | ✓ |
| AC-5 | Connect carries no service offer (headline `HABLEMOS`, plain subtitle) | ✓ |
| AC-6 | YouTube channel link in the footer | ✓ |
| AC-7 | `index.html`, `manifest.json`, `llms.txt` match in Spanish | ✓ |
| AC-8 | Quality gates unchanged (lint, type-check, unit, e2e) | ✓ |

## Files Added / Modified

| File | Change |
|------|--------|
| `apps/web/src/lib/i18n.ts` | `lng: 'es'`, `caches: []` |
| `apps/web/src/components/home/{Header,Builder,Connect}.tsx` | toggle removed, pillars line, static subtitle + YouTube link |
| `apps/web/src/data/builder.ts` | `pillarsKey` |
| `apps/web/src/lib/error-boundary.tsx` | copy via `i18n.t` |
| `apps/web/src/locales/{es,en}/home.json` | new copy, mirrored keys |
| `apps/web/{index.html,public/manifest.json,public/llms.txt}` | Spanish metadata |
| `apps/web/src/lib/quarter(.test).ts` | deleted |
| `apps/web/src/**/*.test.*`, `apps/e2e/tests/home.spec.ts` | updated to Spanish, new forced-es and mobile tests |

## Patterns Introduced

- Force one language while keeping the bilingual infra: explicit `lng` plus `detection.caches: []`.
- Hide an optional `Nav` slot by omitting its prop (no CSS).

## Decisions

- Pillar 3 renamed from "Curaduría" to "Biblioteca" (agreed with rumbo).
- Connect headline changed from `CONSTRUYE_SISTEMAS_NOTABLES_AHORA` to `HABLEMOS` during the smoke check; the old one can return once external-work authorization (B-019) is resolved.
- Review requested one Major (`caches` not applied); fixed in 9f4f1de. History in `gate-log.md`.
- Out of scope, paused: Buy Me a Coffee, consulting CTA, newsletter, video section, /uses, blog.

## Test Coverage

- Unit: `pnpm --filter @me/web test` (43), `pnpm --filter @me/ui test` (38)
- E2E (Playwright): `pnpm --filter @me/e2e test` (10)
