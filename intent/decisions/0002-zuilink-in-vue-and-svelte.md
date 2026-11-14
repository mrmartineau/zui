# 0002. `Link` is exported as `ZuiLink` from Vue and Svelte

**Status:** accepted (recorded 2026-11-01; decision predates this record)

## Context

Vue apps commonly register router link components; Svelte apps often have
their own `Link`. A bare `Link` export collides in templates.

## Decision

Vue and Svelte export the link component as `ZuiLink`. Astro, React and Solid
export `Link`. Documented in `docs/src/pages/guides/vue.mdx` and `svelte.mdx`.

## Consequences

D5 (parity) treats `ZuiLink` as `Link` via `EXPORT_RENAMES` in the oracle. Any
new rename needs its own record and an entry there.
