# Constitution — me

> Inviolable principles for this project. Each principle is enforced by `/j-flow-review` as a blocking gate.
> Keep this list short (3–10 principles). Descriptive context belongs in PRODUCT.md / DESIGN.md.
> Add, change, or remove principles only through an explicit team decision — not during a feature build.

## Principles

### P1 — performance-first

No unbundled/unused dependencies, no unnecessary client-side JS for static content, images optimized/lazy-loaded. Core Web Vitals (LCP, CLS, INP) must not regress across a PR.

**Rationale**: high-performance experiences is a core brand value (PRODUCT.md Unique Angle) — a slow personal site undermines the pitch.

### P2 — simplicity over cleverness

Favor the plainest working solution. No premature abstractions, no config for values that never change, no speculative extensibility for features not in the current backlog phase.

**Rationale**: this is a personal site built and maintained solo — complexity has to be justified by an actual current need, not a hypothetical future one.

### P3 — scope stays inside declared Layers

Only build for layers listed in PRODUCT.md's `**Layers:**` field (currently `web`). No backend/api or mobile code until that field is updated.

**Rationale**: v1 is web-only by design (see PRODUCT.md Out of Scope) — building unused layers is wasted effort and surface area to maintain.

### P4 — accessible, semantic markup

Semantic HTML elements over generic `div`/`span` where one exists, all interactive elements keyboard-reachable, sufficient color contrast against the dark theme tokens in DESIGN.md.

**Rationale**: best practices is a stated brand value — accessibility is table stakes for a professional engineering portfolio, not optional polish.

### P5 — full-height, page-like sections

Each top-level, nav-destination section on a page's desktop layout (≥1024px) fills exactly one viewport height (minus any fixed header) — never taller, never shorter — so scrolling between sections feels like moving between independent, self-contained pages rather than one long-scroll document. Content inside must be laid out to fill that fixed height (flexible images, area-proportional grids, etc.), not allowed to grow the section taller; a per-section internal scroll is an acceptable last-resort fallback only when content genuinely can't fit.

**Rationale**: this "independent pages" navigation feel was established on the landing route (`04-design-polish`, AC-13) and is now a durable structural rule for the site, not a one-feature choice.

## Change log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-21 | Initial constitution | Jonathan Fierro |
| 2026-07-28 | Added P5 (full-height, page-like sections) | Jonathan Fierro |
