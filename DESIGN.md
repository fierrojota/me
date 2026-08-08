# me Design System — Kinetic Logic | Lime

> Source of truth for design tokens. `packages/ui` mirrors these for React.
> Reference mockups live in `docs/mockups/` (kept private — unshipped design work).

---

## Brand & Philosophy

**Personality:** Aggressive, efficient, unmistakably digital — Minimalist Brutalism × Modern Dark Mode, "machine-first" terminal aesthetic
**Aesthetic target:** developer-tool precision meets high-energy, kinetic interface
**Emotional target:** clarity under pressure for a technical audience (developers, sysadmins, data analysts) — urgency and precision via high contrast, sharp geometry, and vibrant Cyber-Lime accents guiding the eye to primary actions and status

**Default mode:** dark — this is a single dark-theme design, no light mode planned. The "Light mode" table below intentionally mirrors the dark tokens as a fallback (never surfaced in the UI as a distinct theme).

---

## Color Tokens

Full Material Design 3–style token set. React: CSS custom properties under `data-theme="dark"`.

### Dark mode (primary/only theme)

| Token | Value | Usage |
|---|---|---|
| `background` | `#0b1326` | Page background |
| `surface` | `#0b1326` | Elevated surfaces |
| `surface-dim` | `#0b1326` | Dimmed surface |
| `surface-bright` | `#31394d` | Brightest surface |
| `surface-container-lowest` | `#060e20` | Lowest elevation container |
| `surface-container-low` | `#131b2e` | Low elevation container |
| `surface-container` | `#171f33` | Standard container |
| `surface-container-high` | `#222a3d` | High elevation container |
| `surface-container-highest` | `#2d3449` | Highest elevation container |
| `on-surface` | `#dae2fd` | Primary text on surfaces |
| `on-surface-variant` | `#c3c9b2` | Secondary text on surfaces |
| `inverse-surface` | `#dae2fd` | Inverse surface |
| `inverse-on-surface` | `#283044` | Text on inverse surface |
| `outline` | `#8d937e` | Borders, dividers |
| `outline-variant` | `#434938` | Subtle borders |
| `surface-tint` | `#a4d64c` | Tint overlay |
| `primary` | `#fefff1` | Brand primary (near-white, headline emphasis) |
| `on-primary` | `#233600` | Text on primary |
| `primary-container` | `#bef264` | **Cyber-Lime** — primary interactive/CTA background, active states, success indicators (used sparingly, boldly) |
| `on-primary-container` | `#4b6e00` | Text on primary container (dark text on lime) |
| `inverse-primary` | `#476800` | Inverse primary |
| `secondary` | `#bcc7de` | Structural components — sidebars, headers, card backgrounds |
| `on-secondary` | `#263143` | Text on secondary |
| `secondary-container` | `#3e495d` | Secondary container |
| `on-secondary-container` | `#aeb9d0` | Text on secondary container |
| `tertiary` | `#fffdff` | Borders, inactive icons, secondary information |
| `on-tertiary` | `#233144` | Text on tertiary |
| `tertiary-container` | `#d4e2fb` | Tertiary container |
| `on-tertiary-container` | `#566579` | Text on tertiary container |
| `error` | `#ffb4ab` | Error states |
| `on-error` | `#690005` | Text on error |
| `error-container` | `#93000a` | Error container |
| `on-error-container` | `#ffdad6` | Text on error container |
| `primary-fixed` | `#bff365` | Fixed primary tone |
| `primary-fixed-dim` | `#a4d64c` | Fixed primary dim tone |
| `on-primary-fixed` | `#131f00` | Text on fixed primary |
| `on-primary-fixed-variant` | `#354e00` | Text on fixed primary variant |
| `secondary-fixed` | `#d8e3fb` | Fixed secondary tone |
| `secondary-fixed-dim` | `#bcc7de` | Fixed secondary dim tone |
| `on-secondary-fixed` | `#111c2d` | Text on fixed secondary |
| `on-secondary-fixed-variant` | `#3c475a` | Text on fixed secondary variant |
| `tertiary-fixed` | `#d5e3fc` | Fixed tertiary tone |
| `tertiary-fixed-dim` | `#b9c7df` | Fixed tertiary dim tone |
| `on-tertiary-fixed` | `#0d1c2e` | Text on fixed tertiary |
| `on-tertiary-fixed-variant` | `#3a485b` | Text on fixed tertiary variant |
| `surface-variant` | `#2d3449` | Surface variant |

**Component-level color usage (see mockup):**
- Background base: `background` (`#0b1326`)
- Cards/panels: `surface-container` (`#171f33`), 1px border `secondary-container` (`#3e495d`)
- Primary CTA (e.g. "INITIALIZE_VIEW_SYSTEMS"): `primary-container` (`#bef264`) bg, `on-primary-container`-dark text (`#0b1326`), JetBrains Mono, bold/uppercase
- Secondary CTA: transparent bg, 1px `primary-container` border, `primary-container` text
- Focused/active borders: `primary-container` at reduced opacity

### Light mode

Not planned for v1 — mirrors dark mode tokens above (single-theme site).

---

## Typography

**Font families:**
- Headings/body: `Geist` — clean, technical sans-serif; headlines use tight tracking and heavy weight
- Labels/metadata/status codes: `JetBrains Mono` — evokes a coding environment, visually separates technical data from prose

**Scale:**

| Token | Size | Weight | Line height | Letter spacing | Usage |
|---|---|---|---|---|---|
| `headline-lg` | 48px (32px mobile) | 700 | 1.1 (mobile 1.2) | -0.02em | Hero |
| `headline-md` | 24px | 600 | 1.3 | — | Section headings |
| `body-lg` | 18px | 400 | 1.6 | — | Lead body text |
| `body-md` | 16px | 400 | 1.5 | — | Body text |
| `label-md` | 14px | 500 | 1.4 | 0.05em | Labels, tags (e.g. `[ STATUS: ... ]`) |
| `label-sm` | 12px | 500 | 1.4 | 0.1em | Fine metadata, footer text |

---

## Spacing Scale

4px baseline rhythm ("strict fluid grid" — mathematical order, 8px/16px alignment).

| Token | Value | Usage |
|---|---|---|
| `base` | 4px | Baseline unit |
| `gutter` | 16px | Grid gutter (desktop: 24px, see Layout) |
| `margin` | 24px | Page/side margins |
| `container-max` | 1280px | Max content width |

**Rounding:** `0px` everywhere — strictly sharp corners (see Shapes). No rounding scale; brutalist aesthetic rejects rounded corners entirely.

---

## Layout & Grid

- **Desktop:** 12-column grid, 24px gutters, content centered, max-width 1280px
- **Tablet:** 8-column grid, 16px gutters, 24px side margins
- **Mobile:** 4-column grid, 16px gutters, 16px side margins
- Vertical stacks for data, horizontal "command bars" for actions
- Whitespace used for structural isolation of data clusters, not decorative luxury

---

## Elevation & Depth

**Tonal layering + high-contrast outlines** — no soft shadows, ever:

- Surface 0 (background): `background` (`#0b1326`)
- Surface 1 (cards/panels): `surface-container` (`#171f33`)
- Borders: all elevated elements get a 1px border — `secondary-container` (`#3e495d`) standard, `primary-container` (`#bef264`) at reduced opacity for focused/active state
- Depth reads through color-value shifts and crisp outlines only — flat, "tactical" look

---

## Shapes

Strictly **sharp (0px radius)** — buttons, cards, inputs, containers all use right angles. No rounded corners anywhere; reinforces the brutalist, "constructed"/rigid tone.

---

## Component Patterns

### Buttons
- **Primary:** bg `primary-container` (`#bef264`), text `background`-dark (`#0b1326`), `JetBrains Mono` bold/uppercase
- **Secondary:** transparent bg, 1px `primary-container` border, `primary-container` text

### Chips / Status
- `JetBrains Mono` text. Success/Active: lime (`primary-container`) bg, dark text. Error: high-contrast red (`error`) bg, white text.

### Input Fields
- Bg `surface-container`, 1px border `secondary-container`. Focus: border shifts to `primary-container` with 1px inner stroke.

### Cards
- Sharp corners, bg `surface-container`, 1px border `secondary-container`, no shadow. Headers within cards get a subtle bottom border.

### Lists
- High-density rows, separated by 1px `surface-container` borders. Hover: full-row highlight shifting to `secondary-container`.

### Data Visualizations
- Primary series: `primary-container` (lime). Supporting series: mid/low-contrast neutrals — keep lime as the sole focal point.

### Navigation
- Header: text links, active state = lime (`primary-container`) color change

(Further components documented in `packages/ui/src/{component}/README.md` as they're built.)
