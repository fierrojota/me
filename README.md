# me

**[jotafierro.me](https://jotafierro.me)** — personal brand site for a software engineer, showcasing projects, values, and (later) writing.

Custom design, built from scratch. But the site itself is only half the story — the other half is *how* it's built.

## How this site is built

I don't ship by vibes. Every feature begins as a written spec — problem, acceptance criteria, technical design — is built against that spec, and passes a review gate before it lands. The process artifacts are public on purpose; they're the part of a portfolio most sites hide:

- **[Engineering principles](CONSTITUTION.md)** — the non-negotiables every change is held to
- **[Design system](DESIGN.md)** — tokens, color system, and component specs
- **[System behaviors](.specs/_system/)** — a living spec of how the system actually behaves
- **Shipped features** — each with its functional spec, technical spec, and review findings:
  - [01 · Infrastructure base](.specs/01-infra-base/)
  - [02 · Observability](.specs/02-observability/)
  - [03 · Design system](.specs/03-design-system/)
  - [04 · Design polish](.specs/04-design-polish/)
- **[Architecture & feature writeups](docs/)** — deeper dives per feature

This is spec-driven development run with [**j-flow**](https://github.com/jotafierro/j-flow) — an open-source workflow I built for Claude Code — spec → build → QA gate → review, one feature at a time.

## Stack

- **Web:** React 19 + Vite + React Router
- **Styling:** plain CSS with design tokens (CSS custom properties) — no utility framework
- **i18n:** i18next
- **Observability:** Sentry SDK → GlitchTip
- **E2E:** Playwright
- **UI catalog:** Storybook (React)
- **Infra:** GitHub Actions + Vercel

> Phase 1 is a static, API-less site, so there's deliberately no data-fetching or client state library. React Query, a global store, and a utility-CSS framework will come in Phase 2 when the content API lands.

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env file
cp .env.example .env
```

## Run

| Service | Command | URL |
|---------|---------|-----|
| Web | `pnpm --filter @me/web dev` | http://localhost:3001 |
| Storybook | `pnpm --filter @me/ui storybook` | http://localhost:6006 |
| Storybook docs | see [docs/STORYBOOK.md](docs/STORYBOOK.md) | |
| Playwright docs | see [docs/PLAYWRIGHT.md](docs/PLAYWRIGHT.md) | |

## Tests

```bash
pnpm test                                    # all unit tests
pnpm --filter @me/e2e test                   # Playwright E2E
```

## License

[MIT](LICENSE) © Jonathan Fierro
