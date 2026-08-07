# Gate Context — 02-observability

> Append-only. Each phase adds one block. Subsequent skills read this file first.

[FUNCTIONAL SPEC] approved 2026-07-22
  → key decisions: Sentry SDK via GlitchTip cloud (DSN app.glitchtip.com/26058), web-only scope, ErrorBoundary + tracing + replay + docs, no CONSTITUTION amendment

[TECHNICAL SPEC] approved 2026-07-22
  → architecture: @sentry/react init in apps/web/src/lib/sentry.ts, Sentry.ErrorBoundary wrap in main.tsx, no new backend/data layer
  → patterns: unified @sentry/react package, inline env reads (no config module), beforeSend level-filter array lookup

[TASK PLAN] approved 2026-07-22
  → 3 tasks across 2 layers (ui, infra), 7 ACs covered

  ⚠ smoke check ui 2026-07-23 — partial: envelope request confirmed built/fired correctly (SDK init working), full GlitchTip ingest verification blocked locally by browser ad-blocker (net::ERR_BLOCKED_BY_CLIENT, client-side only, not app bug). AC-1/2/4/5/6 checklist left unchecked in review/web.md — full manual pass deferred until infra-1 lands apps/web/.env.example + real .env DSN, retest with extensions disabled

  ✓ smoke check infra 2026-07-23 — AC-7 confirmed: docs/OBSERVABILITY.md and apps/web/README.md Observability section verified

[BUILD] completed 2026-07-23
  → layers: ui ✓ infra ✓ (data - service - api - mobile -)

[QA] green 2026-07-23
  → 8 unit tests passing (@me/web), 1 Playwright e2e passing, lint clean, Storybook build clean, checklist 6/6
  → NestJS E2E / Flutter integration N/A (no api/mobile layers); manual checklist confirmed by user 2026-07-23, review/web.md flipped

[QA] green (automated re-run) 2026-07-24
  → re-ran stages 1,2,5,6 after fix 4d71f41 (hand-rolled error-boundary.tsx + deferred initSentry() dynamic import): lint clean, 9 unit tests passing (3 files, +error-boundary.test.tsx), 1 Playwright e2e passing, Storybook build clean
  → bundle-size fix verified: main entry chunk 193.23 kB/61.17 kB gzip; sentry-*.js (236.47 kB/77.74 kB gzip) code-split and NOT referenced in dist/index.html (genuinely deferred)

[QA] green 2026-07-24
  → 9 unit tests passing (@me/web), 1 Playwright e2e passing, lint clean, Storybook build clean, checklist 6/6
  → AC-1 re-confirmed by user against hand-rolled error-boundary.tsx; AC-2/4/5/6 carried forward (sentry.ts unchanged by fix); bundle regression resolved (+1.16 kB gzip vs. +89.34 kB)

[REVIEW] changes-requested 2026-07-24
  → 1 major (real config value embedded in review-guide.md/review/web.md), 2 minor (stale docs/OBSERVABILITY.md lines), 1 minor (tasks.json file-list gap) — see review-findings.md

[QA] green 2026-07-24
  → re-ran after fix eaa5b45 (review findings: config value moved out of spec docs, stale OBSERVABILITY.md lines fixed, tasks.json file-list backfilled) — no app source touched
  → lint clean, 9 unit tests passing (3 files, unchanged), 1 Playwright e2e passing, Storybook build clean, checklist 6/6 (carried forward, no source change to re-verify)

[REVIEW] approved 2026-07-24
  → constitution: ✓ 4 principles checked
  → ponytail: ✓ 0 findings (lean already)
  → 3 findings resolved (1 major, 2 minor)
