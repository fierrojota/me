# Design polish (landing page)

> The homepage now looks and works like a finished product — polished visuals, real project data, working bilingual support, and a landing page that feels like a sequence of full-screen pages rather than a long scroll.

**Added:** 2026-07-29
**Slug:** 04-design-polish

---

## What it does

Rebuilds the site's homepage to match the approved visual design: a fixed navigation bar, an introduction section, a section about the author, a showcase of real projects, and a way to get in touch — all fully translated between English and Spanish, and laid out so each major section fills the screen like its own page when you navigate to it on desktop.

## Who it's for

Anyone visiting the site — recruiters, potential collaborators, or clients evaluating the author's work. No login or account needed.

## Capabilities

- **Full-screen navigation**: on desktop, clicking a nav link takes you to a section that fills the whole screen, with a smooth animated underline showing which section you're currently viewing — giving the feel of flipping through pages rather than scrolling a long document.
- **Real project showcase**: the featured-projects section now shows the author's actual public GitHub projects (not placeholders), with each project's card sized based on its importance — and any card can be clicked to open that project's page in a new tab.
- **About the builder**: a dedicated section introduces the author, including a direct link to their current employer's website.
- **Bilingual by default**: every section's text can be switched between English and Spanish instantly, with your choice remembered on your next visit.
- **Works everywhere**: the layout adapts cleanly across desktop, tablet, and mobile screens, with a simple menu button replacing the full navigation bar on small screens.
- **Get in touch**: a dedicated contact section with a clear call-to-action and links to GitHub, LinkedIn, and email.

## Related

- Technical architecture: [docs/architecture/04-design-polish.md](../architecture/04-design-polish.md)
- Internal spec: `.specs/04-design-polish/functional-spec.md`
