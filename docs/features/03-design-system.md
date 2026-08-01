# Design System

> The visual foundation the whole site is built on — colors, type, spacing, and the reusable building blocks every page will use.

**Added:** 2026-07-24
**Slug:** 03-design-system

---

## What it does

Establishes the look and feel of jotafierro.me before any real page ships: the dark, high-contrast "Kinetic Logic" visual style, the reusable pieces (buttons, status tags, cards, form fields, navigation) that every future page will be built from, and the groundwork to show the site in either English or Spanish. Nothing user-facing ships yet — this is the toolkit the landing page and blog will draw from.

## Who it's for

- The site owner/developer building future pages, who now has a consistent, documented set of building blocks instead of writing one-off styles per page.
- Future visitors, indirectly — this ensures every page they eventually see (landing page, blog) looks and behaves consistently, in their preferred language.

## Capabilities

- **Consistent visual language**: every future page can pull the same colors, type sizes, and spacing instead of reinventing them.
- **Ready-made buttons**: primary (bold, high-contrast call-to-action) and secondary (outlined) buttons, both fully usable by keyboard.
- **Status tags**: small bordered labels for showing state (active, error, neutral), matching the site's terminal-inspired look.
- **Cards**: bordered content containers with an optional header, used for things like project showcases or bio sections.
- **Form fields**: a styled text input with a visible focus state, ready for future forms (like a contact form).
- **Site navigation**: a header with a logo area, links, and an optional call-to-action, with the active page highlighted.
- **Responsive layout**: a grid system that adapts across desktop, tablet, and mobile.
- **Component catalog**: every building block is browsable and documented in a live style-guide (Storybook), including accessibility checks.
- **Language support groundwork**: the site can now detect a visitor's browser language and serve English or Spanish content, defaulting sensibly when a translation isn't ready yet.

## Related

- Technical architecture: [docs/architecture/03-design-system.md](../architecture/03-design-system.md)
- Internal spec: `.specs/03-design-system/functional-spec.md`
