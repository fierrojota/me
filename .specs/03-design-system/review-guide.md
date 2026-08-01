# Review Guide — 03-design-system
Generated: 2026-07-24

## Environment

```bash
pnpm --filter @me/web dev                 # web  → http://localhost:3001
pnpm --filter @me/ui storybook            # UI catalog → http://localhost:6006
```

**Required env vars for this feature:** none new.

**Seed data:** none.

## Per-Layer Testing Docs

Single-layer feature (`ui` only — no data/service/api/mobile/infra changes). No E2E doc: this feature ships no page, only primitives + Storybook catalog + i18n foundation.

| Layer | File | ACs covered |
|-------|------|-------------|
| Web (Storybook + primitives) | [review/web.md](review/web.md) | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9, AC-10 |

## Approval Criteria

All per-layer checklists green → feature approved for `/j-flow-review`.
Any blocker found → run `/j-flow-build --fix`, then re-run `/j-flow-qa`.
