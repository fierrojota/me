# Review Guide — 02-observability
Generated: 2026-07-22

## Environment

```bash
pnpm --filter @me/web dev                 # :3001
```

**Required env vars for this feature (`apps/web/.env`):**
- `VITE_SENTRY_DSN` — GlitchTip DSN (see `apps/web/.env`, gitignored — real value never committed); empty = SDK no-ops
- `VITE_SENTRY_TRACES_SAMPLE_RATE` — default `0.2`
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` — default `0.1`
- `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` — default `1.0`
- `VITE_SENTRY_LEVEL` — default `warning`

**Seed data:** none.

## Per-Layer Testing Docs

Run in this order: web (only client layer with tasks — no api/mobile/admin in this feature).

| Layer | File | ACs covered |
|-------|------|-------------|
| Web   | [review/web.md](review/web.md) | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6 |

AC-7 (docs) is verified by file existence, not a browser check — see `docs/OBSERVABILITY.md` and `apps/web/README.md` directly.

## Approval Criteria

All per-layer checklists green → feature approved for `/j-flow-review`.
Any blocker found → run `/j-flow-build --fix`, then re-run `/j-flow-qa`.
