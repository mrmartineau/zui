# Design-system rules

Checked by `packages/zui/src/intent/design-system.oracle.test.ts`, which reads
the real CSS AST (lightningcss) and captures every real `cva()` config as the
shared modules load. Runs with `pnpm --filter @mrmartineau/zui test`.

## D1. Every class a variant can emit exists in the CSS

Every class in a cva `base`, `variants` or `compoundVariants` is a selector
somewhere in `src/css/`.

- **Why:** a typo or a variant added to `shared/` without CSS ships a prop
  that silently does nothing, in five frameworks at once.
- **Check:** D1.

## D2. A component's base rule never sets its public `--zui-*` knobs

`.zui-card { --zui-card-radius: … }` is wrong; read the knob with a fallback
into a private `--_card-*` property instead.

- **Why:** setting the public knob on the element beats any value inherited
  from `:root` or an ancestor, so theming stops working.
- **Assumes:** "base rule" = a selector that is exactly the cva `base` class.
  Variant classes, part classes (`.zui-card-title`) and contextual overrides of
  another component's knobs (`.zui-app-shell-toggle-tooltip` setting
  `--zui-tooltip-*`) are allowed.
- **Check:** D2.

## D3. The default variant's class never sets a public knob

If `shape: 'default'` maps to a class, that class mustn't set
`--zui-card-radius`.

- **Why:** same as D2; the default is always applied.
- **Check:** D3, using each config's `defaultVariants`.

## D4. Component CSS is layered and uses tokens for colour

Every file in `css/components/` is in `@layer zui.components`. No hex,
`rgb()`/`hsl()` literals; use tokens, `light-dark()`, `oklch(from …)` or
`color-mix()`.

- **Why:** unlayered CSS beats consumer overrides; raw colours ignore theme and
  dark mode.
- **Not checked yet:** raw spacing, radii, font sizes and z-indices. AGENTS.md
  forbids them "when a token exists", which needs a token→value map to check.
  Candidate next rule.
- **Check:** D4.

## D5. Every component is exported from all five entry points

The PascalCase component exports of `astro`, `react`, `solid`, `svelte` and
`vue` `index.ts` are the same set.

- **Why:** the library promises parity. A component in four frameworks is a
  bug report waiting to happen.
- **Exceptions:** per-framework renames listed in `EXPORT_RENAMES` in the
  oracle, each with a decision record (see 0002).
- **Check:** D5.

## D6. Every public knob a component reads is documented

Every `var(--zui-…)` read in `css/components/` appears somewhere in
`docs/src/pages/**/*.mdx`.

- **Why:** AGENTS.md: "Every new knob goes in the component's docs table." An
  undocumented knob is API nobody can find.
- **Check:** D6. Only checks the name appears in docs, not that it's in the
  right component's table.

## Baselines

The oracle has `KNOWN_*` lists for debt that existed when a rule was written.
All are empty as of 2026-11-01. They should only shrink.
