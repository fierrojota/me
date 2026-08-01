# Storybook — me

Storybook 10 catalog for the React design system in `packages/ui`.

## Run

```bash
pnpm --filter @me/ui storybook
# Opens http://localhost:6006
```

## Where stories live

- `packages/ui/src/components/*.tsx` — components
- `packages/ui/src/components/*.stories.tsx` — stories co-located with components

## Adding a story

```tsx
// MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = { component: MyComponent };
export default meta;
export const Default: StoryObj<typeof MyComponent> = { args: { ... } };
```

## Design tokens

Tokens live in [`DESIGN.md`](../DESIGN.md). Use CSS variables exposed via the design-system stylesheet; never hardcode colors.

## Default theme

This project's default theme is **dark** (configured in `packages/ui/.storybook/preview.tsx`).

## Upgrading

```bash
cd packages/ui
npx storybook@latest upgrade
```

Storybook's own upgrade CLI updates every `@storybook/*` package to the same version and runs any needed automigrations against `.storybook/main.ts`/`preview.tsx`. After upgrading:

- **Check `.storybook/main.ts`'s `addons` array for unrequested additions.** The automigration has previously auto-installed `@storybook/addon-mcp` (a Storybook MCP server integration) with an unmet `valibot` peer-dependency warning — not something this project uses. Removed after the 10.5.5 upgrade; if a future upgrade reintroduces it (or anything else not explicitly chosen), remove it from both `.storybook/main.ts`'s `addons` array and `package.json`'s `devDependencies` unless there's a real reason to keep it.
- Run `pnpm install` at the repo root (the upgrade CLI updates `packages/ui/package.json` and the workspace lockfile together, but a clean install confirms nothing is left dangling).
- Verify `pnpm --filter @me/ui type-check`, `pnpm --filter @me/ui test`, and `pnpm --filter @me/ui build-storybook` all still pass before committing.
