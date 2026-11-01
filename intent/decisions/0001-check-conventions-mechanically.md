# 0001. Check AGENTS.md conventions mechanically

**Status:** accepted, 2026-11-01

## Context

AGENTS.md has precise rules (knob resolution, layers, tokens, five-framework
parity, docs for every knob). They were only enforced by an agent or person
remembering them. A component touched in one framework and not the others, or
a knob set in a base rule, passes CI today.

## Decision

Encode the checkable rules as `intent/design-system.md` D1-D6 and check them in
`src/intent/design-system.oracle.test.ts` against the lightningcss AST and the
real cva configs (captured by wrapping `cva` in a vitest mock), not regexes.

## Consequences

- Each check was mutation-tested when written: breaking the code fails exactly
  that check.
- No existing violations, so baselines are empty.
- Rules that need a token→value map (raw spacing, radii, z-index) aren't
  checked yet; noted under D4.
- Docs check (D6) is name-presence only.
