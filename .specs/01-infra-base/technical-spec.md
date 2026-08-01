# Technical Spec — 01-infra-base

Web-only monorepo scaffold (PRODUCT.md `**Layers:** web`) — no apps/api, apps/admin, or apps/mobile.

## Directory tree

```
.
├── apps/
│   ├── web/            React + Vite (port 3001)
│   └── e2e/            Playwright (tests apps/web)
├── packages/
│   ├── ui/              React design system + Storybook (port 6006)
│   ├── domain/          Shared TS types
│   └── config/          Shared tsconfig + eslint base
├── .github/workflows/ci.yml
├── docs/{STORYBOOK,PLAYWRIGHT}.md
├── package.json          Turborepo root
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── .npmrc
```

## Notes

- `packages/api-client` not generated — no `api` layer declared
- No `docker-compose.yml` / root `.env` Mongo block — no backend to run locally
- Default theme: dark (single theme, per DESIGN.md)
- Adding `api`/`mobile`/`admin` later: update PRODUCT.md `**Layers:**`, re-run `/j-flow-scaffold`
