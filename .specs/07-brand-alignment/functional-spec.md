# Functional Spec — Brand alignment
Date: 2026-10-08

## Purpose

Align jotafierro.me with the brand positioning (rumbo B-036): Spanish as the only visible language, landing copy that states the positioning and the three content pillars, and a path from the site to the YouTube channel. Copy and wiring only — no redesign (rumbo brand constitution §7.3).

## Feature users

Public visitors (Spanish-speaking tech leads, architects, senior devs; secondary: professionals 30–45 following the "life in construction" pillar).

## Trigger

A visitor loads `/`.

## Acceptance criteria

### AC-1 — Spanish is the only language

**Given** any visitor, whatever their browser language or a previously stored language
**When** `/` loads
**Then:**
- All copy renders in Spanish
- `<html lang>` is `es`
- A stored `en` value in localStorage does not switch the page to English
- The English locale files and the bilingual i18n infrastructure remain in the repo, unused by the UI

### AC-2 — Language toggle hidden

**Given** a visitor on any viewport
**When** the header renders (desktop bar or collapsed mobile menu)
**Then:**
- No language selector is rendered or focusable
- The `LanguageToggle` primitive and its Storybook story remain in `packages/ui`
- Nav links keep their layout (centered, active underline) without the toggle's slot looking empty

### AC-3 — Hero states the positioning

**Given** a visitor loads `/`
**When** the Hero renders
**Then:**
- Headline and subcopy express: "El ingeniero que le pone proceso a todo — al código y a la vida", keeping the existing prefix/highlight/suffix headline structure (highlight in lime with underline)
- The STATUS chip and both CTAs keep their current terminal-style wording and behavior
- No claim of availability for hire or services

### AC-4 — Builder bio reflects the published bio

**Given** a visitor scrolls to the Builder section
**When** the section renders
**Then:**
- The bio conveys: senior backend, husband, two daughters, basketball, all built between 5:30 and 9:30 AM
- The 3 pillars (Ingeniería y carrera · Vida en construcción · Biblioteca) are visible as copy inside the Builder section
- No daughters' names, ages or photos; no absolute money figures; no academic-degree claim

### AC-5 — Connect carries no service offer

**Given** a visitor scrolls to Connect
**When** the section renders
**Then:**
- The headline reads `HABLEMOS` (replacing the pitch-style `CONSTRUYE_SISTEMAS_NOTABLES_AHORA`)
- The subtitle no longer says the author accepts engineering partnerships/collaborations, and no quarter/availability text remains
- The email CTA (mailto) stays as a plain contact point
- The `nextQuarter()` usage is removed from the component if no longer needed

### AC-6 — YouTube channel link

**Given** a visitor on `/`
**When** the Connect footer renders
**Then:**
- A link to https://www.youtube.com/@fierrojota renders in the footer, opens in a new tab with `rel="noopener noreferrer"`, with an accessible name that includes its visible text (label-in-name)
- Footer lists GITHUB / LINKEDIN / YOUTUBE / EMAIL
- No separate button is added next to the email CTA

### AC-7 — Metadata and machine-readable files match

**Given** a crawler or LLM reads the site
**When** it fetches `index.html`, `llms.txt`
**Then:**
- `<html lang="es">`, title/description and `llms.txt` use the new positioning in Spanish and list the YouTube channel
- Nothing mentions services, newsletter or support links

### AC-8 — Quality gates unchanged

**Given** the change is built
**When** lint, type-check, unit tests, Playwright e2e and a11y checks run
**Then:**
- All pass; tests that assumed EN/ES switching are updated or removed accordingly; no new hardcoded strings outside i18n

## Scope

**In scope:** Spanish-only wiring, toggle hidden, copy (Hero, Builder, Connect), YouTube footer link, ErrorBoundary copy via i18n, `llms.txt`/meta, update of `_system/landing-page.md` (AC-11 superseded) at finish.

**Out of scope:** Buy Me a Coffee, consulting CTA, newsletter, videos section, /uses, blog, "Sobre mí" page, any redesign, deleting the EN locale/i18n infra, UBB degree, daughters' details, money figures.

## Dependencies

03-design-system, 04-design-polish (landing). Rumbo B-036 / rumbo brand constitution §7.3, §7.4 (not this repo's CONSTITUTION.md, which defines P1–P6). Contract clause 8.1 (ADR-0006).

## Edge cases

- Visitor with `en` in localStorage or an English browser: still sees Spanish.
- Mobile menu without toggle: menu content and active underline unaffected.
- Re-enabling English later = restoring the toggle + detector order, no copy rewrite.

## Risks

- Hiding the toggle removes English access for recruiters abroad. Accepted by Jota (B-036, until English reaches B2).
- SEO: `lang="es"` only; no hreflang needed while single-language.
