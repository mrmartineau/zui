# 0001. Check AGENTS.md conventions mechanically

**Status:** accepted, 2026-11-01

## Context

AGENTS.md has precise rules (knob resolution, layers, tokens, five-framework
parity, docs for every knob). They were only enforced by an agent or person
remembering them. A component touched in one framework and not the others, or
a knob set in a base rule, passes CI today.

## Decision

Encode the checkable rules as `intent/design-system.md` D1-D6 and check them in
`packages/zui/src/intent/design-system.oracle.test.ts`. Selectors, custom
properties and colours come from the lightningcss AST; variants from the real
cva configs (captured by wrapping `cva` in a vitest mock). Layer nesting (D4a)
uses a brace-depth scan; exports (D5) and knob docs (D6) use targeted text
matching on `index.ts` and the MDX pages.

## Consequences

- Each check was mutation-tested when written: breaking the code fails exactly
  that check.
- One baseline: the backdrop scrim literal in two components (D4); no token exists for it yet.
- Rules that need a token→value map (raw spacing, radii, z-index) aren't
  checked yet; noted under D4.
- Docs check (D6) is name-presence only.
