# ZUI — Claude Guidelines

## Project Overview

ZUI is a CSS-first UI library (`@mrmartineau/zui`) with optional React, Astro, Solid, Svelte, and Vue component wrappers. See `AGENTS.md` for full architecture and conventions — everything there applies here too.

## Intent first

`intent/` holds the design-system promises (D1-D6) and decision records.
`packages/zui/src/intent/design-system.oracle.test.ts` checks them against the
real CSS AST and cva configs: variants ↔ CSS, knob rules, layers, five-framework
parity, documented knobs. Runs in CI and on a Claude Code Stop hook.

If a check fails, fix the change or edit the rule in `intent/` first and say
why. Never grow a `KNOWN_*` baseline to get green. Use the `record-intent` skill
when a session settles something new; the `intent-reviewer` agent checks a diff.

## Critical Rules

1. **Update the docs site.** Any new component, token, utility, or API change must be reflected in the Astro docs site at `docs/`. Create or update the relevant `.mdx` page and add sidebar entries in `docs/src/components/Sidebar.astro`.

2. **Reuse existing styles, tokens, and components.** Before writing new CSS or creating new helpers, check:
   - `packages/zui/src/css/tokens/` for design tokens (`--space-*`, `--color-*`, `--radius-*`, `--shadow-*`, `--step-*`, `--ease-*`, `--z-*`, etc.)
   - `packages/zui/src/css/theme.css` for semantic tokens (`--color-text`, `--color-background`, `--color-surface`, `--color-border`, `--color-theme`, `--color-accent`)
   - `packages/zui/src/css/utilities/` for utility classes
   - `packages/zui/src/css/components/` for existing component styles
   - `docs/src/components/` for existing demo helpers (`Demo`, `CodeTabs`, `ButtonRow`, `TokenGrid`, etc.)

3. **Use Phosphor Icons.** Never use hard-coded inline SVGs. Use `<i class="ph ph-icon-name"></i>` in HTML/Astro, or import from `@phosphor-icons/react` in React. Browse available icons at https://phosphoricons.com/.

4. **Follow the layer system.** CSS must be wrapped in the correct `@layer`: `zui.reset`, `zui.base`, `zui.components`, or `zui.utilities`.

5. **Use the `zui-` class prefix** for all component CSS classes.

6. **Multi-layer components.** New components need: CSS in `packages/zui/src/css/components/`, Astro wrapper in `packages/zui/src/astro/`, React wrapper in `packages/zui/src/react/`, Solid wrapper in `packages/zui/src/solid/`, Svelte wrapper in `packages/zui/src/svelte/`, Vue wrapper in `packages/zui/src/vue/`, shared variants in `packages/zui/src/shared/` (using `cva`), and exports added to every `index.ts` file.

7. **Colour handling.** Use `light-dark()` for theme-aware colours. Use `oklch(from …)` relative colour syntax for transparency or tint variations — don't create new tokens for every shade.

8. **Docs-site integrations.** A package that adds UI or a Cloudflare binding to the docs site (e.g. `astro-d1-reactions`, `astro-d1-search`) needs three checks before it counts as done:
   - **Theme it with ZUI tokens** in `docs/src/styles/<lib>-zui.css`. Map the package's variables to `--color-*`, `--radius-*`, `--shadow-*`, `--font-*`. Keep the file unlayered if the package's CSS is unlayered. See `reactions-zui.css` and `sonner-zui.css`.
   - **Check light and dark** in a browser. A default dark widget can look fine in dark mode and fail in light mode.
   - **Test the live site after deploy.** Call the real API, and apply D1 migrations in `.github/workflows/deploy.yml`. A passing build does not prove the database has tables.

## Build & Dev

```sh
pnpm run build        # Build CSS bundle + React components
pnpm run dev          # Watch mode

cd docs
pnpm run dev          # Run docs site locally
```
