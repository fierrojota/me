# Observability

> Catches runtime errors and slow pages automatically so problems can be fixed before visitors notice.

**Added:** 2026-07-24
**Slug:** 02-observability

---

## What it does

If something breaks while someone is browsing the site, or a page loads slower than it should, it's now caught and reported automatically — without visitors having to say anything. This runs quietly in the background and never changes what a visitor sees or does on the site.

## Who it's for

The site owner/developer — who checks a dashboard to see errors, slow pages, and session recordings, so problems can be found and fixed proactively.

## Capabilities

- **Graceful error recovery**: if a page hits an unexpected error, visitors see a simple "Something went wrong" message instead of a blank screen, and can keep browsing normally afterward.
- **Automatic error reporting**: errors are recorded automatically, with enough detail to diagnose and fix them, with no visitor action required.
- **Performance visibility**: page loads and navigation are automatically timed, surfacing slow spots.
- **Session playback**: a sample of visitor sessions can be replayed to see exactly what happened before an issue, with all text and media automatically hidden for privacy.
- **Tunable sensitivity**: how much detail gets reported can be adjusted without touching any code.

## Related

- Technical architecture: [docs/architecture/02-observability.md](../architecture/02-observability.md)
- Internal spec: `.specs/02-observability/functional-spec.md`
