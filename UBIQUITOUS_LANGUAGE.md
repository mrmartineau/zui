# Ubiquitous Language

> Domain glossary for ZUI — a CSS-first UI library with optional framework wrappers.
> Built from `AGENTS.md`, `CLAUDE.md`, and the package structure.

## CSS architecture

| Term                | Definition                                                                                          | Aliases to avoid                |
| ------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------- |
| **Cascade layer**   | A CSS `@layer` controlling specificity order: `zui.reset`, `zui.base`, `zui.components`, `zui.utilities` | layer (ambiguous), tier         |
| **Design token**    | A raw CSS custom property holding a primitive scale value (`--space-*`, `--color-*`, `--radius-*`, `--step-*`, `--ease-*`, `--z-*`) | variable, constant              |
| **Semantic token**  | A theme-aware token in `theme.css` naming a role, not a value (`--color-text`, `--color-surface`, `--color-border`, `--color-accent`) | colour variable, theme token    |
| **Palette token**   | A raw colour token from the underlying palette (e.g. Tailwind colour scale), consumed by semantic tokens | raw colour                      |
| **Component class** | A `zui-`-prefixed CSS class implementing one component's styling (`zui-button`, `zui-card`)          | the component (when meaning CSS) |
| **Variant class**   | A modifier class selecting a component variation (`zui-button-variant-outline`)                      | modifier, option                |
| **Utility class**   | A single-purpose CSS class in the `zui.utilities` layer (`flex`, `flow`, `prose`, `gap`)            | helper class                    |
| **Bundle**          | The compiled `dist/css/zui.css`, produced from the modular source by tsdown / Lightning CSS          | build, output                   |

## Component model

| Term            | Definition                                                                                                      | Aliases to avoid              |
| --------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Component**   | A complete UI primitive spanning six artefacts: the CSS, plus an Astro, React, Solid, Svelte, and Vue wrapper   | widget, element               |
| **Wrapper**     | A single framework's binding for a component (`.astro`, `.tsx`, `.svelte`, `.vue`)                              | component (when meaning a wrapper) |
| **Shared variants** | The `cva`-based variant definitions in `src/shared/`, imported by every wrapper so variant logic stays single-sourced | variant config                |
| **Variant**     | A named visual option of a component (e.g. `outline`, `solid`), declared once in shared variants                | style, mode                   |

## Theming

| Term           | Definition                                                                                          | Aliases to avoid            |
| -------------- | --------------------------------------------------------------------------------------------------- | --------------------------- |
| **Colour scheme** | A light or dark rendering, resolved per-value with CSS `light-dark()`                             | theme (when meaning light/dark), mode |
| **Relative colour** | A derived colour via `oklch(from …)` for tint/shade/transparency, used instead of new tokens     | colour function             |
| **Docs theme** | The publishable `@mrmartineau/zui-theme` package — the Astro docs shell other projects reuse        | theme (when meaning the package) |

## Documentation

| Term         | Definition                                                                                            | Aliases to avoid       |
| ------------ | ----------------------------------------------------------------------------------------------------- | ---------------------- |
| **Docs site** | The Astro site at `docs/`, the living documentation and reference consumer of the docs theme         | site, docs (ambiguous) |
| **Doc page**  | One `.mdx` page documenting a component, token, or utility, registered in `Sidebar.astro`            | page                   |
| **Demo**      | The `Demo` component rendering a live preview plus its source code on a doc page                      | example, preview       |
| **Demo helper** | A presentational doc-only component (`ColorPalette`, `ShadowGrid`, `SpaceBar`, `TokenGrid`) used to illustrate the system | helper, widget         |

## Relationships

- A **Component** owns exactly one **Component class** and one **Wrapper** per framework (Astro, React, Solid, Svelte, Vue).
- Every **Wrapper** imports the same **Shared variants**; a **Variant** is defined once there and surfaced as a **Variant class** in CSS.
- A **Semantic token** resolves to **Palette tokens** (or `light-dark()` pairs of them); a **Component class** references **Semantic** and **Design tokens**, never raw values.
- Every **Component class** and **Utility class** lives in exactly one **Cascade layer**.
- The **Docs site** consumes both `@mrmartineau/zui` and the **Docs theme**; each **Component** must gain a **Doc page** when added.

## Example dialogue

> **Dev:** "I'm adding a `zui-badge`. Do I write the colours inline?"

> **Maintainer:** "No — reference **semantic tokens** like `--color-surface` and `--color-border`. If you need a faint tint, derive it with a **relative colour** (`oklch(from …)`) rather than minting a new **design token**."

> **Dev:** "And the variants — solid vs outline — go in each **wrapper**?"

> **Maintainer:** "Define them once as **shared variants** with `cva`. The Astro, React, Solid, Svelte, and Vue **wrappers** all import that, and `cva` emits the **variant class** (`zui-badge-variant-outline`) onto the **component class**."

> **Dev:** "Which **cascade layer** does the CSS sit in?"

> **Maintainer:** "`zui.components`. Utilities go in `zui.utilities` so they can override. Then add a **doc page** under `docs/src/pages/components/` and a **Demo** — that's not optional."

> **Dev:** "When I touch `theme.css`, am I editing the **docs theme**?"

> **Maintainer:** "No — different thing. `theme.css` holds the library's **semantic tokens**. The **docs theme** is the `@mrmartineau/zui-theme` package, the reusable docs shell. Don't conflate them."

## Flagged ambiguities

- **"layer"** is overloaded. It means a CSS **cascade layer** (`@layer zui.components`), but `AGENTS.md` also says "every component has six layers" — meaning its six framework artefacts (CSS + five wrappers), which are *not* `@layer`s. Use **cascade layer** for the CSS concept and **artefact / wrapper** for the six-part component makeup.
- **"token"** splits three ways: a **design token** (raw scale primitive), a **semantic token** (role-named, theme-aware, in `theme.css`), and a **palette token** (raw colour the semantic tokens map onto). Always qualify which.
- **"theme"** means two unrelated things: a **colour scheme** (light/dark via `light-dark()`) and the **docs theme** (`@mrmartineau/zui-theme` package). Never bare "theme" — say **colour scheme** or **docs theme**.
- **"component"** is used for both the CSS class and the framework binding. Reserve **component** for the whole six-artefact primitive; say **component class** for the CSS and **wrapper** for a single framework's binding.
