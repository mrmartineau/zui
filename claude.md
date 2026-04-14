# ZUI — Claude Guidelines

## Project Overview

ZUI is a CSS-first UI library (`@mrmartineau/zui`) with optional React, Astro, Solid, Svelte, and Vue component wrappers. See `AGENTS.md` for full architecture and conventions — everything there applies here too.

## Critical Rules

1. **Update the docs site.** Any new component, token, utility, or API change must be reflected in the Astro demo site at `demo/`. Create or update the relevant `.mdx` page and add sidebar entries in `demo/src/components/Sidebar.astro`.

2. **Reuse existing styles, tokens, and components.** Before writing new CSS or creating new helpers, check:
   - `src/css/tokens/` for design tokens (`--space-*`, `--color-*`, `--radius-*`, `--shadow-*`, `--step-*`, `--ease-*`, `--z-*`, etc.)
   - `src/css/theme.css` for semantic tokens (`--color-text`, `--color-background`, `--color-surface`, `--color-border`, `--color-theme`, `--color-accent`)
   - `src/css/utilities/` for utility classes
   - `src/css/components/` for existing component styles
   - `demo/src/components/` for existing demo helpers (`Demo`, `CodeTabs`, `ButtonRow`, `TokenGrid`, etc.)

3. **Use Phosphor Icons.** Never use hard-coded inline SVGs. Use `<i class="ph ph-icon-name"></i>` in HTML/Astro, or import from `@phosphor-icons/react` in React. Browse available icons at https://phosphoricons.com/.

4. **Follow the layer system.** CSS must be wrapped in the correct `@layer`: `zui.reset`, `zui.base`, `zui.components`, or `zui.utilities`.

5. **Use the `zui-` class prefix** for all component CSS classes.

6. **Multi-layer components.** New components need: CSS in `src/css/components/`, Astro wrapper in `src/astro/`, React wrapper in `src/react/`, Solid wrapper in `src/solid/`, Svelte wrapper in `src/svelte/`, Vue wrapper in `src/vue/`, shared variants in `src/shared/` (using `cva`), and exports added to every `index.ts` file.

7. **Colour handling.** Use `light-dark()` for theme-aware colours. Use `oklch(from …)` relative colour syntax for transparency or tint variations — don't create new tokens for every shade.

## Build & Dev

```sh
pnpm run build        # Build CSS bundle + React components
pnpm run dev          # Watch mode

cd demo
pnpm run dev          # Run docs site locally
```
