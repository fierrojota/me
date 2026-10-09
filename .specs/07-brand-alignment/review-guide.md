# Review Guide — 07-brand-alignment
Generated: 2026-10-08

## Environment

```bash
pnpm --filter @me/web dev              # :3001
```

No API, no MongoDB, no Docker — web-only feature (`PRODUCT.md` Layers: web).

**Required env vars for this feature:** none new.

**Seed data:** none.

## Per-Layer Testing Docs

Run in this order: web (only layer with tasks in this feature).

| Layer | File | ACs covered |
|-------|------|-------------|
| Web   | [review/web.md](review/web.md) | AC-1 – AC-8 |

_No API/mobile/admin/e2e review doc — single-layer (ui) feature. Playwright coverage is task ui-8 (`apps/e2e/tests/home.spec.ts`)._

## Approval Criteria

Web checklist green → feature approved for `/j-flow-review`.
Any blocker found → run `/j-flow-build --fix`, then re-run `/j-flow-qa`.
