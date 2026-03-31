# ZUI — Agent Guidelines

## Project Overview

ZUI is a CSS-first UI library with optional React, Astro, Solid, and Vue component wrappers. CSS is authored as modular source files in `src/css/` using `@import` and `@layer`, then bundled with [tsdown](https://tsdown.dev/) (Lightning CSS) into `dist/css/zui.css`.

## Architecture

```
src/
  css/
    layers.css          → Layer order: zui.reset, zui.base, zui.components, zui.utilities
    theme.css           → Semantic colour tokens, font settings (user-editable)
    reset.css           → Minimal reset
    tokens/             → Design tokens as CSS custom properties (space, color, radii, shadow, easing, etc.)
    components/         → Component styles (button, badge, card, input, etc.)
    utilities/          → Utility classes (flex, flow, prose, spacing, etc.)
    layouts/            → Layout styles
  astro/                → Astro components (.astro files)
  react/                → React components (.tsx files)
  solid/                → Solid components (.tsx files)
  vue/                  → Vue components (.vue SFCs)
  shared/               → Shared variant definitions using `cva` (consumed by Astro, React, Solid & Vue)
demo/                   → Astro docs site (see "Documentation" below)
```

## Key Conventions

### CSS

- All styles live in `src/css/` and must be placed in the correct `@layer` (`zui.reset`, `zui.base`, `zui.components`, or `zui.utilities`).
- Component class names use the `zui-` prefix (e.g. `zui-button`, `zui-button-variant-outline`).
- Use existing design tokens (`--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--step-*`, `--ease-*`, `--z-*`, etc.) — never hard-code raw values for spacing, colours, radii, shadows, font sizes, or z-indices when a token exists.
- Use CSS `light-dark()` for colour values that differ between themes. Reference semantic tokens from `theme.css` (e.g. `--color-text`, `--color-background`, `--color-surface`, `--color-border`, `--color-theme`, `--color-accent`) over raw palette tokens where appropriate.
- Use CSS relative colour syntax (`oklch(from …)`) to derive transparency, tints, or shade variations rather than adding new tokens.
- Border style uses `var(--border-style)`.

### Components

- Every component has five layers: CSS class in `src/css/components/`, an Astro wrapper in `src/astro/`, a React wrapper in `src/react/`, a Solid wrapper in `src/solid/`, and a Vue wrapper in `src/vue/`.
- Shared variant logic (using `cva`) lives in `src/shared/` and is imported by Astro, React, Solid, and Vue components.
- Astro components use `HTMLAttributes` from `astro/types` and `VariantProps` from `cva`.
- React components use standard React types and `VariantProps` from `cva`.
- Solid components use `JSX` types from `solid-js`, `splitProps`, and `VariantProps` from `cva`.
- Vue components use `<script setup lang="ts">` with `defineProps`, `defineOptions({ inheritAttrs: false })`, and `VariantProps` from `cva`.
- Export new components from `src/astro/index.ts`, `src/react/index.ts`, `src/solid/index.ts`, and `src/vue/index.ts`.

### Icons

- **Always use [Phosphor Icons](https://phosphoricons.com/) via the `@phosphor-icons/web` package** — never hard-code inline SVGs.
- In HTML/Astro templates: `<i class="ph ph-icon-name"></i>` (regular weight) or `<i class="ph-duotone ph-icon-name"></i>` (duotone weight).
- In React: import from `@phosphor-icons/react`.
- The demo site loads Phosphor CSS from the CDN in `demo/src/layouts/Layout.astro`.

### Build

- `pnpm run build` — builds CSS bundle and React components via tsdown.
- `pnpm run dev` — watches and rebuilds.
- The demo site links to the parent package via `"@mrmartineau/zui": "file:.."`.

## Documentation (Demo Site)

The Astro docs site at `demo/` is the living documentation for ZUI. **Whenever you create new code or refactor existing code, you must update the docs site to reflect the changes.**

### Documentation Rules

1. **New components** → Create a doc page at `demo/src/pages/components/<name>.mdx` and add a sidebar entry in `demo/src/components/Sidebar.astro`.
2. **New tokens** → Add to the appropriate page in `demo/src/pages/tokens/` or create a new one if it's a new token category. Update the sidebar.
3. **New utilities** → Document in `demo/src/pages/utilities/`. Update the sidebar.
4. **Refactored or changed APIs** → Update every affected doc page to show current class names, props, and usage.
5. **Removed features** → Remove or update the corresponding doc sections. Don't leave stale docs.

### Doc Page Conventions

- Pages use the layout `../../layouts/Layout.astro` and MDX format.
- Use the `Demo` component (`demo/src/components/Demo.astro`) for live preview + code blocks.
- Use the `CodeTabs` component (`demo/src/components/CodeTabs.astro`) to show HTML, React, and Astro usage side by side.
- Use existing demo helper components (`ButtonRow`, `TokenGrid`, `ColorPalette`, etc.) — check `demo/src/components/` before creating new ones.
- Shiki code highlighting uses `rose-pine-dawn` (light) and `rose-pine` (dark) themes.

### Reuse Over Duplication

- Before creating new CSS, tokens, components, or demo helpers, check if an existing one can be reused or extended.
- Prefer composing existing utility classes and tokens over writing new CSS.
- Check `demo/src/components/` for existing presentational helpers before building new ones for doc pages.
