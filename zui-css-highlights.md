# Interesting modern CSS in ZUI

A menu of the genuinely modern / under-used CSS features baked into ZUI, with short summaries and minimal code examples. Pick the ones you want to write about — they're roughly ordered from "most novel / most visual" to "solid fundamentals".

Every code snippet is copied from or distilled from the real library (`packages/zui/src/css`). File references are included so you can grab the full context.

---

## 1. Automatic contrast text — computed entirely in CSS

**The standout trick.** ZUI buttons never declare a foreground colour for the `fill` variant. Instead they derive readable text from whatever background colour you throw at them — black text on light buttons, white text on dark buttons — using a pure-CSS luminance threshold. No JavaScript, no precomputed pairs, no `contrast-color()` (which is still landing in browsers).

The mechanism: read the background's OKLCH lightness with relative colour syntax, then abuse `clamp()` with `* -infinity` to snap it to a hard 0/1 switch at a threshold.

```css
/* packages/zui/src/css/components/button.css */
.zui-button {
  --auto-threshold: 0.6;
  --auto-light-text-l: 1;   /* white text  */
  --auto-dark-text-l: 0.5;  /* dark text   */

  /* If bg lightness is below the threshold → 1 (white),
     above → clamped down to the dark value. The `* -infinity`
     turns a smooth ratio into a binary step. */
  --auto-color: oklch(
    from var(--zui-btn-bg)
      clamp(
        var(--auto-dark-text-l),
        calc((l / var(--auto-threshold) - 1) * -infinity),
        var(--auto-light-text-l)
      )
      0 0 / 1
  );

  color: var(--zui-btn-fg, var(--auto-color));
}
```

Why it's interesting: this is the kind of thing you'd previously reach for JS (or Sass functions, or a build step) to do. Here it's reactive — change the background custom property at runtime and the text colour recomputes itself. Worth contrasting with the emerging native `contrast-color()` function, which aims to do the same thing declaratively.

> Note for the post: ZUI credits this pattern to "Graffiti's auto-color class" in a code comment — worth a hat-tip if you write it up. The real declaration also wraps it in `light-dark()` and factors in alpha; the snippet above is the simplified core.

---

## 2. OKLCH + relative colour syntax (`oklch(from …)`)

**Used pervasively (~57 times).** Every colour adjustment in ZUI — hover states, tints, shadows, muted text — is derived from a base colour rather than hand-picked. OKLCH is perceptually uniform, so "subtract 0.1 lightness" looks consistent across hues. Relative colour syntax (`from`) lets you keep some channels and tweak others, in plain CSS.

```css
/* Darken on hover, keep hue + chroma */
--zui-btn-accent-hover: oklch(from var(--zui-btn-accent) calc(l - 0.1) c h);

/* Same colour at 15% alpha — for subtle backgrounds */
--zui-btn-accent-subtle-bg: oklch(from var(--zui-btn-accent) l c h / 15%);

/* Muted/faint text from the text colour, no new token needed */
--color-muted: oklch(from var(--color-text) l c h / 70%);
--color-faint: oklch(from var(--color-text) l c h / 50%);

/* Even derive the shadow colour from the background */
--shadow-color: oklch(from var(--color-background) calc(l - 0.3) c h);
```

The angle for the post: **one base token, infinite derivations.** ZUI deliberately avoids minting a new variable for every shade/opacity — it computes them. (Source: `theme.css`, `button.css`, `shadow.css`, `tokens/color-tailwind.css` — the whole Tailwind-style palette is OKLCH too, e.g. `--color-slate-200: oklch(92.9% 0.013 255.508)`.)

---

## 3. `light-dark()` — theme-aware colour without media queries

**Used ~34 times.** The semantic theme is defined once. Each token names its light value and dark value inline; the browser picks based on `color-scheme`. No `@media (prefers-color-scheme)` duplication, no `.dark` class selectors fighting specificity.

```css
:root {
  --color-background: light-dark(var(--color-mist-200), var(--color-mist-800));
  --color-text:       light-dark(var(--color-mist-700), var(--color-mist-300));
  --color-accent:     light-dark(var(--color-sky-600),  var(--color-sky-400));
}

/* Opt a subtree into a fixed scheme: */
:root.zui-dark  { color-scheme: dark; }
:root.zui-light { color-scheme: light; }
```

It composes with everything else too — e.g. a `light-dark()` wrapping two `oklch(from …)` calls so the derived shade flips direction in dark mode. (Source: `theme.css`, `core.css`.)

---

## 4. `color-mix()` for muted text and subtle tints

Used for "65% of the text colour, 35% transparent" muted captions and faint surface tints — mixed in the OKLCH space for nicer blends than sRGB.

```css
.zui-field-description {
  color: color-mix(in oklch, var(--color-text) 65%, transparent);
}

/* Subtle surface = 4% text colour over the surface colour */
--zui-tabs-list-bg: color-mix(in oklch, var(--color-text) 4%, var(--color-surface));
```

Good "two ways to do the same thing" beat for the post: `color-mix(... X%, transparent)` vs `oklch(from … l c h / X%)` — ZUI uses both, and it's worth noting when each reads better. (Source: `field.css`, `label.css`, `card.css`, `tabs.css`, `input.css`.)

---

## 5. Scrollbars — themed, stable, no layout shift

**You flagged this one.** ZUI styles scrollbars with the standardised properties (not the old `::-webkit-scrollbar` soup), reserves space so content never jumps when a scrollbar appears, and colours the thumb from the theme token — including a `light-dark()` + `oklch(from …)` derivation so it adapts to dark mode automatically.

```css
html {
  scrollbar-gutter: stable; /* reserve the gutter → no layout shift */
}

* {
  scrollbar-width: thin;
  scrollbar-color:
    light-dark(
      oklch(from var(--color-theme) calc(l - 0.1) c h),
      oklch(from var(--color-theme) calc(l + 0.1) c h / 30%)
    )
    transparent; /* thumb colour, then track colour */
}
```

Three modern features in one tidy block: `scrollbar-gutter`, the standard `scrollbar-width`/`scrollbar-color` pair, and theme-derived colour. (Source: `core.css`.)

---

## 6. Component variants: CVA on top, CSS custom properties underneath

**Your "variants on buttons" idea.** The interesting part isn't CVA itself — it's that **variants never rewrite CSS rules; they only reassign custom properties.** The base `.zui-button` is written entirely in terms of `--zui-btn-*` variables. Every variant, size, and colour is just a different set of variable values. No combinatorial explosion of selectors, no duplicated declarations.

The TypeScript layer (CVA) is a thin prop→classname map:

```ts
// packages/zui/src/shared/buttonVariants.ts
export const buttonVariants = cva({
  base: 'zui-button',
  defaultVariants: { color: 'theme', size: 'md', variant: 'fill', shape: 'default' },
  variants: {
    variant: {
      fill:    'zui-button-variant-fill',
      subtle:  'zui-button-variant-subtle',
      outline: 'zui-button-variant-outline',
      ghost:   'zui-button-variant-ghost',
      link:    'zui-button-variant-link',
    },
    color: {
      theme:       'zui-button-color-theme',
      accent:      'zui-button-color-accent',
      destructive: 'zui-button-color-destructive',
    },
    // size, shape, icon …
  },
})
```

…and the CSS those classes hook into just swaps variables:

```css
/* Base reads everything from custom properties */
.zui-button {
  background-color: var(--zui-btn-bg);
  color: var(--zui-btn-fg, var(--auto-color));
  border: 1px solid var(--zui-btn-border, transparent);
}

/* Colour variant = set ONE accent; everything else cascades from it */
.zui-button.zui-button-color-accent      { --zui-btn-accent: var(--color-accent); }
.zui-button.zui-button-color-destructive { --zui-btn-accent: var(--color-error); }

/* Style variant = recompose the same handful of variables */
.zui-button.zui-button-variant-outline {
  --zui-btn-bg: transparent;
  --zui-btn-fg: var(--zui-btn-accent);
  --zui-btn-border: oklch(from var(--zui-btn-accent) l c h / 30%);
  --zui-btn-hover-bg: oklch(from var(--zui-btn-accent) l c h / 20%);
}

/* Size variant = geometry variables only */
.zui-button.zui-button-size-sm {
  --zui-btn-height: 1.5rem;
  --zui-btn-font-size: var(--step--2);
  --zui-btn-padding-inline: var(--space-2xs);
}
```

The story for the post: **CVA is optional sugar.** Strip it away and the same buttons work in plain HTML with classes — because the actual logic lives in CSS custom properties, not in JS. The React/Astro/Solid/Svelte/Vue wrappers are all ~30 lines that call `buttonVariants()` and spread props. Same pattern across badge, avatar, tabs, field, etc.

```tsx
// The entire framework wrapper, essentially:
const classes = buttonVariants({ variant, color, size, shape, className })
return <button className={classes} {...props} />
```

---

## 7. Cascade layers (`@layer`) — specificity as architecture

The whole library is partitioned into four ordered layers, declared once. Reset can never accidentally beat a component; a utility always wins over a component — by layer order, not by selector weight. This is what lets ZUI keep flat, low-specificity selectors everywhere.

```css
/* packages/zui/src/css/layers.css */
@layer zui.reset, zui.base, zui.components, zui.utilities;
```

```css
@layer zui.components {
  .zui-button { /* … */ }
}
```

Worth pairing with a note on `:where()` (zero specificity) which ZUI uses for base styles you can override without a fight. (Source: `layers.css`, every component file.)

---

## 8. Open/close animations with `@starting-style` + `allow-discrete`

Animating elements **into** existence (and out, including `display: none`) used to require JS or hacks. ZUI does it declaratively: `@starting-style` provides the "before it appears" values, and `transition-behavior`/`allow-discrete` lets normally un-animatable properties like `display` and `overlay` participate.

```css
/* packages/zui/src/css/components/tooltip.css */
.zui-tooltip-content {
  opacity: 0;
  translate: 0 4px;
  transition:
    opacity   150ms var(--ease-out),
    translate 150ms var(--ease-out),
    display   150ms var(--ease-out) allow-discrete,
    overlay   150ms var(--ease-out) allow-discrete;

  &:popover-open { opacity: 1; translate: 0 0; }

  /* the entry-from state */
  @starting-style {
    &:popover-open { opacity: 0; translate: 0 4px; }
  }
}
```

This is the modern answer to "why do I need a library to fade a modal in and out". (Source: `tooltip.css`, `dialog.css`, `popover.css`, `drawer-slide.css`.)

---

## 9. Popover API + anchor positioning + `::backdrop`

Tooltips and popovers are built on native primitives: the `[popover]` attribute (top-layer, light-dismiss for free), `:popover-open` for state, `::backdrop` for the scrim, and **CSS anchor positioning** (`position-area`) to place the floating element relative to its trigger — no Popper.js, no JS positioning loop.

```css
.zui-tooltip-content              { position-area: block-start center; }
.zui-tooltip-placement-bottom     { position-area: block-end center; }
.zui-tooltip-placement-left       { position-area: center inline-start; }

.zui-dialog::backdrop {
  background-color: oklch(0% 0 0 / 50%);
  backdrop-filter: blur(2px);
}
```

Note the logical keywords (`block-start`, `inline-start`) so placement flips correctly in RTL. (Source: `tooltip.css`, `popover.css`, `dialog.css`, `app-shell.css`.)

---

## 10. `field-sizing: content` — auto-growing textareas, zero JS

One line replaces the classic "mirror the textarea in a hidden div and sync the height" JavaScript dance.

```css
.zui-textarea {
  field-sizing: content; /* grows + shrinks with what you type */
}
```

(Source: `textarea.css`.)

---

## 11. Animating to `auto` — `interpolate-size` and native `<details>` accordions

Two related modern wins. `interpolate-size: allow-keywords` finally makes height transitions to/from `auto` possible. And ZUI's accordion/collapsible are real `<details>` elements, animated via the new `::details-content` pseudo-element — accessible by default, no ARIA wiring.

```css
html {
  interpolate-size: allow-keywords; /* enables transitions to height:auto */
}

.zui-accordion-item::details-content {
  block-size: 0;
  overflow: clip;
  transition:
    block-size 250ms allow-discrete,
    content-visibility 250ms allow-discrete;
}
.zui-accordion-item[open]::details-content {
  block-size: auto;
}
```

(Source: `core.css`, `accordion.css`, `collapsible.css`.)

---

## 12. `corner-shape: squircle` — iOS-style superellipse corners

Behind an `@supports` guard (it's bleeding-edge), ZUI offers Apple-style "squircle" corners via the new `corner-shape` property with a `superellipse()` value, falling back to a normal `border-radius`.

```css
.zui-button.zui-button-shape-squircle {
  border-radius: 20px; /* fallback */
  @supports (corner-shape: squircle) {
    corner-shape: superellipse(1.25);
  }
}
```

A nice "here's what's coming next" beat. (Source: `button.css`, `avatar.css`.)

---

## 13. Spring easing with `linear()`

Spring/bounce motion without a physics library. The `linear()` easing function approximates any curve via sampled points — ZUI ships a spring as a token.

```css
:root {
  --ease-spring: linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%,
    0.849 31.5%, 0.937 38.1%, 0.991 45.7%, 1.006 50.1%,
    1.015 55%, 1.017 63.9%, 1.001
  );
  /* plus a full set of cubic-bezier elastic/squish curves */
  --ease-elastic-out: cubic-bezier(0.5, 0.75, 0.75, 1.25);
}
```

(Source: `tokens/easing.css`.)

---

## 14. `text-wrap: balance` / `pretty`

Headings get balanced line lengths; descriptions and errors avoid orphans — both one-liners that used to need JS (Balance Text et al.).

```css
h1, h2, h3            { text-wrap: balance; }
.zui-field-description { text-wrap: pretty; }
```

(Source: `prose.css`, `field.css`.)

---

## 15. Container queries — components that respond to their slot, not the viewport

Form field groups switch to a two-column grid based on the **container's** width, so the same component lays out correctly in a wide page or a narrow sidebar.

```css
.zui-field-group { container-type: inline-size; }

@container (min-width: 32rem) {
  .zui-field-responsive {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

(Source: `field.css`.)

---

## Smaller fundamentals worth a mention (probably a "and a few more" section)

- **Logical properties everywhere** — `margin-inline`, `padding-block`, `border-inline-start`, `inset` — RTL/vertical-writing ready by default. (`utilities/margin.css`, `app-shell.css`.)
- **The flow utility (the "lobotomized owl")** — `.flow > * + * { margin-block-start: var(--flow-space, 1em); }`, with headings overriding `--flow-space` contextually. (`utilities/flow.css`.)
- **`accent-color`** — native checkboxes/radios/range inputs themed in one line: `accent-color: var(--color-theme)`. (`core.css`.)
- **`:focus-visible`** — focus rings only for keyboard users, via a `--focus-ring` token. (`core.css`.)
- **Dynamic viewport units** — `100dvh` for full-height layouts that respect mobile browser chrome; `svh`/`lvh`/`dvh` exposed as size tokens. (`reset.css`, `dialog.css`, `tokens/size.css`.)
- **Native CSS nesting** — `&`, nested pseudo-classes/elements, no Sass/PostCSS preprocessor in the pipeline. (Throughout.)
- **`isolation: isolate`** on the root to create a clean stacking context and dodge z-index wars. (`reset.css`.)
- **`prefers-reduced-motion`** honoured globally — animations collapse to ~0ms for users who ask. (`core.css`.)

---

### Suggested narrative arc for the article

1. Open with the **auto-contrast button** (#1) — it's the "wait, CSS can do *that*?" hook.
2. Zoom out to the **colour engine**: OKLCH + relative syntax (#2), `light-dark()` (#3), `color-mix()` (#4). One base token → everything derived.
3. **Variants without the bloat** (#6) — CVA is just sugar over custom properties.
4. **Modern interaction layer** as a cluster: scrollbars (#5), popover/anchor/`::backdrop` (#9), `@starting-style` open/close (#8), `field-sizing` + `::details-content` (#10, #11).
5. Close with the **next-gen sprinkles**: `corner-shape` squircles (#12), `linear()` springs (#13), `text-wrap` (#14), container queries (#15).
6. Tie-off: all of this is **just CSS** — the frameworks are thin wrappers, and the layer system (#7) keeps it maintainable.
