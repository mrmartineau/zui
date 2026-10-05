---
name: migrate-to-zui
description: "Migrate an existing project from another UI library — Tailwind, shadcn/ui, MUI, Chakra, Bootstrap, or a bespoke design system — to the ZUI CSS-first UI library. Covers the audit, token mapping, incremental component migration, old-CSS removal, and verification. Triggers on: migrate to ZUI, port to ZUI, replace Tailwind with ZUI, replace shadcn with ZUI, replace MUI/Chakra with ZUI, drop Tailwind, switch UI library."
user-invocable: true
---

# Migrating to ZUI

Port an existing app from another UI library to [ZUI](https://github.com/mrmartineau/zui) (`@mrmartineau/zui`) without a big-bang rewrite. The two libraries coexist during the migration; the old one is deleted only once nothing imports it.

**Read the `using-zui` skill first** — it is the reference for ZUI's components, tokens, utilities, and rules. This skill is the *process*; that one is the *API*.

## Core principle

ZUI is CSS-first. Migration is mostly **deleting** code, not writing it:

- Utility soup (`className="inline-flex items-center rounded-md bg-primary px-4 py-2 …"`) collapses to one class or one component (`<Button>`).
- Theme config files (`tailwind.config`, MUI `createTheme`, Chakra `extendTheme`) collapse to a handful of CSS custom property overrides in one stylesheet.
- Per-component `styled()`/`sx`/`css` blocks collapse to ZUI component variables (`--zui-btn-*`, `--zui-card-*`).

If a migration is producing more CSS than it removes, it is going wrong — see [Anti-patterns](#anti-patterns).

## Workflow

Work through these phases in order. Don't jump to rewriting components before the tokens are mapped — every component migrated before then gets re-done.

### Phase 0 — Audit

Inventory what actually exists. Don't migrate from the old library's docs; migrate from the codebase's usage.

```sh
# What UI deps are in play?
grep -E '"(tailwindcss|@mui/|@chakra-ui/|bootstrap|@radix-ui/|class-variance-authority)' package.json

# Which of the old library's components are used, and how often?
grep -rhoE '<(Button|Card|Dialog|Modal|Input|Select|Tabs|Menu|Alert|Switch|Table)\b' src | sort | uniq -c | sort -rn

# Where does bespoke styling live? (the hard part of any migration)
grep -rlE 'styled\(|sx=\{|makeStyles|@apply|!important' src | head -30

# How big is the global stylesheet, and what does it reset?
wc -l src/**/*.css
```

Produce a short written inventory before editing anything:

1. **Component usage counts** — migrate highest-count leaf components first (Button, Input, Badge); they give the biggest reduction per edit.
2. **Theme values** — brand colours, spacing scale, radii, fonts, breakpoints. These become the token overrides in Phase 2.
3. **Escape hatches** — every `styled()`, `sx`, `@apply`, `!important`, and one-off override. These are where the migration will actually take time.
4. **Gaps** — components the project uses that ZUI has no equivalent for (see [Filling the gaps](#filling-the-gaps)).

### Phase 1 — Install ZUI alongside the old library

```sh
npm install @mrmartineau/zui
```

Import ZUI's CSS **after** the old library's CSS, and declare the layer order once, at the top of the global stylesheet:

```css
@layer zui.reset, zui.base, zui.components, zui.utilities;

@import '@mrmartineau/zui/css';
```

Then use the framework wrapper that matches the project — `@mrmartineau/zui/react`, `/astro`, `/solid`, `/svelte`, `/vue`. Only hand-write `zui-` classes when the framework has no wrapper.

**Coexistence rules while both libraries are live:**

| Old library | What to do during the overlap |
|---|---|
| Tailwind v3 | Set `corePlugins: { preflight: false }` — ZUI's `zui.reset` replaces preflight, and running both means two resets fighting. |
| Tailwind v4 | Import only the parts you still need (`@import 'tailwindcss/utilities.css'`) instead of the full `tailwindcss` entry, so Preflight is dropped. |
| Bootstrap | Import `bootstrap-grid`/individual component SCSS instead of the full bundle once `reboot` is no longer needed. |
| MUI | Keep `CssBaseline` **out** — it is MUI's reset. Set `ScopedCssBaseline` on not-yet-migrated subtrees if needed. |
| Chakra | Keep `<ChakraProvider resetCSS={false}>` so ZUI's reset owns the base layer. |

Unlayered CSS beats layered CSS, so old-library rules that sit outside `@layer` will still win over `zui.components`. That is fine mid-migration — it means untouched screens keep their old look. It also means **a migrated component may look unstyled until the old rule targeting the same element is deleted**; delete the old rule in the same commit as the component.

### Phase 2 — Map the theme to tokens

This is the highest-leverage phase. The old theme config becomes CSS custom property overrides in one file, applied outside any `@layer` so they win:

```css
:root {
  /* brand */
  --color-theme: oklch(0.55 0.2 265);
  --color-accent: oklch(0.7 0.16 190);

  /* type */
  --font-body: 'Inter', var(--font-stack-sans);

  /* global shape — replaces per-component borderRadius config */
  --radius-scale: 1;
}
```

Map the old theme in this order:

| Old concept | ZUI equivalent |
|---|---|
| `theme.colors.primary` / `palette.primary.main` | `--color-theme` |
| secondary / accent colour | `--color-accent` |
| `background.default`, `background.paper` | `--color-background`, `--color-surface` |
| `text.primary`, `divider` | `--color-text`, `--color-border` |
| success / error / warning palettes | `--color-success`, `--color-error`, `--color-warning` |
| whole spacing scale (`theme.spacing(n)`, `p-4`) | `--space-*` scale — see the tables below |
| type scale (`text-lg`, `typography.h1`) | `--step-*` scale |
| `borderRadius` config | `--radius-*`, globally scaled by `--radius-scale` |
| squircle / smooth corners | `zui-squircle-all` on `<html>` (or `zui-squircle` per element) |
| shadow scale | `--shadow-sm` … `--shadow-2xl` |
| dark mode class/`ThemeProvider` toggle | `light-dark()` values + `color-scheme` — see the `using-zui` skill |

Rules for this phase:

- **Don't recreate the old scale.** ZUI's space and type scales are fluid (`clamp()`), so they don't map 1:1 to a fixed scale. Snap to the nearest ZUI step rather than adding `--space-4-5`-style tokens to preserve old pixel values.
- **Don't add a token per shade.** Derive with relative colour syntax: `oklch(from var(--color-theme) l c h / 0.12)`.
- **Dark mode uses `light-dark()`**, not a duplicated `.dark` block.

### Phase 3 — Migrate components, leaves first

Go bottom-up: leaf controls (Button, Badge, Input, Label) → composites (Card, Field, Table) → layout/shell (AppShell, Dialog, Tabs, Menu) → pages.

For each component, in one commit:

1. Swap the import to the ZUI wrapper.
2. Map props/classes using the tables below.
3. Delete the old component file, its styles, and any global CSS rule that targeted it.
4. Check the rendered result — including hover, focus-visible, disabled, and invalid states.

Keep a shim only when a component is used in 20+ places and can't be swapped in one pass:

```tsx
// components/Button.tsx — temporary shim, delete when call sites are migrated
export { Button } from '@mrmartineau/zui/react'
```

This lets call sites migrate lazily while the old implementation is already gone. Delete the shim before declaring the migration finished — a permanent re-export is just a second API to maintain.

### Phase 4 — Strip the old reset and base styles

Once no component imports the old library, remove from the project's global stylesheet anything ZUI's `zui.reset` / `zui.base` already provide:

- `box-sizing: border-box` on `*`
- global margin reset (`* { margin: 0 }`)
- `body` `font-family` / `line-height`
- media element defaults (`img, video, svg { display: block; max-width: 100% }`)
- font smoothing, `color-scheme`, `:focus-visible` outline, scrollbar styling, reduced-motion handling

**Keep** what ZUI deliberately doesn't reset: list styles, base `a` styling (links use `.zui-link`), base `font-size`, heading styles beyond the margin reset. Migrate those to `prose` / `.zui-link` where it fits, otherwise keep the project's own rules.

After removing them, **don't re-add hard-coded overrides** — go back to Phase 2 and change the token.

### Phase 5 — Remove the dependency and verify

```sh
# nothing should match
grep -rE "from '(@mui|@chakra-ui|tailwind)" src
grep -rE "class(Name)?=\"[^\"]*\b(btn|text-sm|bg-primary|flex items-center)\b" src

npm uninstall tailwindcss @mui/material @emotion/react @emotion/styled  # whatever applies
```

Verification checklist:

- [ ] Old library gone from `package.json`, lockfile, and build config (PostCSS plugins, Babel plugins, Vite plugins).
- [ ] `tailwind.config.*` / theme factory files deleted, not just unused.
- [ ] No `!important` added during the migration (a sign of a layering mistake — fix the layer, not the specificity).
- [ ] Global stylesheet shrank.
- [ ] Every form control is wrapped in a `Field` (ZUI controls carry no margin; `Field` owns form spacing).
- [ ] Keyboard tab order and focus rings work on every interactive element.
- [ ] Both colour schemes checked — ZUI is `light-dark()`-driven, so dark mode regressions show up immediately.
- [ ] No leftover icon libraries — ZUI uses Phosphor (`<i class="ph ph-x"></i>` / `@phosphor-icons/react`).

## Tailwind → ZUI

Most Tailwind classes have no ZUI counterpart **by design** — they belong on a ZUI component instead. Reach for a ZUI component first, a ZUI utility second, scoped CSS with tokens last.

### Spacing (`--space-*`, fluid)

| Tailwind | ZUI utility | Token |
|---|---|---|
| `gap-1` / `p-1` | — | `--space-4xs` |
| `gap-1.5` / `p-1.5` | — | `--space-3xs` |
| `gap-2` / `p-2` | `gap-2xs` / `p-2xs` | `--space-2xs` |
| `gap-3` / `p-3` | `gap-xs` / `p-xs` | `--space-xs` |
| `gap-4` / `p-4` | `gap-sm` / `p-sm` | `--space-sm` |
| `gap-6` / `p-6` | `gap-md` / `p-md` | `--space-md` |
| `gap-8` / `p-8` | `gap-lg` / `p-lg` | `--space-lg` |
| `gap-12` / `p-12` | `gap-xl` / `p-xl` | `--space-xl` |
| `gap-16` / `p-16` | `gap-2xl` / `p-2xl` | `--space-2xl` |
| `gap-24` / `p-24` | `gap-3xl` / `p-3xl` | `--space-3xl` |

Axis variants exist for both: `gapx-*` / `gapy-*`, and `px-*` `py-*` `pt-*` `pb-*` `pl-*` `pr-*` plus `m-*` equivalents. Values are fluid, so a `p-4` → `p-sm` swap is a *near*, not exact, match — check dense layouts visually.

### Layout

| Tailwind | ZUI |
|---|---|
| `flex` / `inline-flex` | `flex` / `inline-flex` |
| `flex items-center` | `flex-center` (or `inline-flex-center`) |
| `flex-col` | `flex-column` (`flex-column-reverse`) |
| `flex-row` | `flex-row` (`flex-row-reverse`) |
| `flex-wrap` / `flex-nowrap` | `flex-wrap` / `flex-nowrap` |
| `flex-1` / `flex-auto` | `flex-auto` |
| `flex-none` / `grow` / `shrink` | `flex-none` / `flex-grow` / `flex-shrink` |
| `items-*` / `justify-*` / `self-*` / `content-*` | same names (`items-center`, `justify-between`, `self-end`, …) |
| `space-y-4` | `flow` (vertical rhythm via `> * + *`) or `stack gap-sm` (`stack` is column flex with no gap of its own) |
| `grid grid-cols-*` | no ZUI utility — write scoped CSS grid using `--space-*` for `gap` |
| responsive prefixes (`md:flex`) | no ZUI equivalent — write a scoped media query |
| arbitrary values (`p-[13px]`) | replace with the nearest token; if genuinely bespoke, scoped CSS |

In React/Astro/Solid/Svelte/Vue, prefer `<Flex direction align justify gap gapX gapY wrap display>` over hand-applied utility classes.

### Typography and colour

| Tailwind | ZUI |
|---|---|
| `text-xs` | `zui-text--2` |
| `text-sm` | `zui-text--1` |
| `text-base` | `zui-text-base` (step 0) |
| `text-lg` | `zui-text-1` |
| `text-xl` | `zui-text-2` |
| `text-2xl` | `zui-text-3` |
| `text-3xl` / `text-4xl` | `zui-text-4` / `zui-text-5` (scale runs `--step--4` … `--step-10`) |
| `text-muted-foreground` | `zui-color-muted` (70%) / `zui-color-faint` (50%) |
| `bg-background` / `bg-card` | `--color-background` / `surface` utility or `zui-card` |
| `text-primary` / `bg-primary` | `--color-theme` |
| `rounded-md` etc. | `--radius-*` on the component variable, not a utility |
| `shadow-md` | `--shadow-md` |
| `sr-only` | `sr-only` / `visually-hidden` |
| `prose` (typography plugin) | `prose` |
| `underline text-blue-600` on `<a>` | `zui-link` / `<Link>` |

### `@apply` and `cn()`

- `@apply` blocks → the equivalent ZUI component class, or a scoped rule using tokens. Never re-implement a ZUI component with `@apply`.
- `cn()` / `clsx` merging Tailwind classes → usually deletable: ZUI variants are props (`variant`, `color`, `size`, `shape`), so conditional class strings become conditional props. `tailwind-merge` can go with them.

## shadcn/ui → ZUI

shadcn components are vendored source in `components/ui/*` — migrating means **deleting those files**, not rewriting them. Radix dependencies go with them where ZUI has a native equivalent.

| shadcn/ui | ZUI | Notes |
|---|---|---|
| `Button` | `Button` | `variant`: `default`→`fill`, `secondary`→`subtle`, `outline`→`outline`, `ghost`→`ghost`, `link`→`link`, `destructive`→`color="destructive"`. `size="icon"` → `icon` prop. |
| `Badge` | `Badge` | `variant`: `default`→`fill`, `secondary`→`subtle`, `outline`→`outline`, `destructive`→`color="red"`. |
| `Card` + parts | `Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardBody`/`CardFooter` | `CardContent` → `CardBody`. |
| `Input`, `Textarea`, `Select`, `Label` | same names | ZUI `Select` is a styled native `<select>`, not a Radix listbox — a shadcn `Select` with custom item rendering needs a headless lib (see gaps). |
| `Checkbox`, `RadioGroup` | `Checkbox`, `Radio` | ZUI renders a `<label>` wrapping a native input; children are the label text. |
| `Form` / `FormField` / `FormItem` | `Field` family | `Field`, `FieldGroup`, `FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend`, `FieldSeparator`. Presentational only — wire `id`/`htmlFor`/`aria-describedby`/`aria-invalid` yourself; keep react-hook-form/zod as-is. |
| `Dialog`, `AlertDialog` | `Dialog` | Native `<dialog>` + `showModal()`. React: controlled `open` + `onClose`. Sizes `sm`/`md`/`lg`/`full`. |
| `Sheet`/`Drawer` | `Dialog` with `zui-dialog-position-left\|right\|top\|bottom` | Slide-in behaviour comes from the shared drawer-slide primitive. |
| `Tooltip` | `Tooltip` | CSS Anchor Positioning + Popover API; no provider component needed — delete `TooltipProvider`. |
| `Popover`, `HoverCard` | `Popover` | Native popover; trigger needs `anchor-name` + `popovertarget`. |
| `DropdownMenu` | `Menu` | `Menu`/`MenuTrigger`/`MenuContent`/`MenuItem`. Action menus only — no checkbox/radio items or submenus. |
| `Tabs` | `Tabs` | `TabsList` `variant="underline"` for the underlined look; `orientation="vertical"` supported. |
| `Accordion`, `Collapsible` | `Accordion`, `Collapsible` | Native `<details>`/`<summary>`; add `name` on items for exclusive open. |
| `Avatar` | `Avatar` | `size`, `shape`, `fallback`. |
| `Table` | `Table` + parts | Headless table libs (TanStack) still work — swap only the markup. |
| `Kbd`, `Separator` | `Kbd`/`KbdGroup`, `FieldSeparator` | |
| `Sidebar` | `AppShell` family | Desktop show/hide + mobile popover drawer + `localStorage` persistence built in; `shortcut` binds Cmd/Ctrl+B. |
| `Switch`, `Alert`, `Toast`/`Sonner`, `Skeleton`, `Progress`, `Slider`, `Command`, `Combobox`, `Calendar`, `Carousel` | — | No ZUI equivalent. See [Filling the gaps](#filling-the-gaps). |

Because shadcn already uses `cva`, prop names often survive the swap — check the variant names against the table above rather than assuming they match.

## MUI / Chakra → ZUI

These are prop-driven, runtime-CSS libraries. The migration is a shift in **where styling lives**: from JS props to CSS custom properties.

| MUI / Chakra pattern | ZUI equivalent |
|---|---|
| `ThemeProvider` + `createTheme` / `extendTheme` | Token overrides in `:root` (Phase 2). No provider. |
| `CssBaseline` / `resetCSS` | `zui.reset` + `zui.base` — remove the old one. |
| `sx={{ p: 4, mb: 2 }}` | `p-sm mb-2xs` utilities, or `style="padding: var(--space-sm)"` |
| `sx={{ color: 'primary.main' }}` | component variable (`--zui-btn-fg`) or `var(--color-theme)` |
| `styled(Button)\`…\`` | scoped CSS overriding the component's variables |
| `useTheme()` / `theme.spacing(2)` in JS | `var(--space-*)` in CSS; drop the hook |
| `<Box>` / `<Stack>` | `<Flex>`, or `flow` / `stack` utilities |
| `<Typography variant="h1">` | real `<h1>` (+ `prose` for long-form), or `<Text size>` |
| `<Grid container spacing={2}>` | scoped CSS grid with `gap: var(--space-2xs)` |
| `<Container maxWidth="md">` | scoped CSS with `max-inline-size` + `margin-inline: auto` |
| `<TextField label helperText error>` | `Field` + `Label` + `Input` + `FieldDescription` / `FieldError` — one MUI prop bundle becomes explicit markup |
| `<FormControl>` / `<FormLabel>` / `FormControl` (Chakra) | `Field` / `FieldSet` + `Label` / `FieldLegend` |
| `<Modal>` / `<Drawer>` | `Dialog` (+ `zui-dialog-position-*` for drawers) |
| `<Snackbar>` / `useToast` | no equivalent — see gaps |
| `<Switch>`, `<Alert>`, `<Skeleton>`, `<LinearProgress>`, `<Slider>`, `<Autocomplete>` | no equivalent — see gaps |
| `color="primary"` / `colorScheme="blue"` | `color="theme" \| "accent" \| "destructive"` on `Button`; `Badge` takes the full colour-name palette |
| `variant="contained" \| "outlined" \| "text"` | `variant="fill" \| "outline" \| "ghost"` |
| `size="small" \| "medium" \| "large"` | `size="sm" \| "md" \| "lg"` (ZUI adds `xs`/`xl`) |

Extra rules for these libraries:

- **Emotion/styled-components can be removed entirely** once the last `styled()` call is gone — check `@emotion/*` and any Babel/SWC plugin config, not just the component imports.
- **Don't port `sx` to inline `style`** wholesale. Most `sx` blocks are spacing and colour; those become utilities and tokens. Only genuinely one-off geometry stays inline.
- **Chakra's `useColorMode`** goes away — ZUI uses `light-dark()` and `color-scheme`. Keep a toggle only if the app needs an explicit user setting.
- **Ripples, `TransitionGroup`, and MUI focus visible polyfills** are not needed; ZUI uses CSS transitions and native `:focus-visible`.

## Any other library (Bootstrap, bespoke design systems)

The workflow above is library-agnostic. For a source with no table here:

1. **Build the mapping table first**, from the audit's component inventory — one row per source component, with its ZUI target or "gap". Get this reviewed before writing code; it's the cheapest place to catch a wrong assumption.
2. **Classify every source class** into: (a) has a ZUI component, (b) has a ZUI utility, (c) is bespoke → scoped CSS using tokens, (d) is dead code → delete. Category (d) is usually larger than expected.
3. **Migrate one route or page end-to-end early** as a pilot. It surfaces layering and token problems while only one screen is affected.
4. **Then go component-by-component** across the app.

Bootstrap-specific quick hits: `btn btn-primary` → `zui-button`; `btn-outline-*` → `zui-button-variant-outline`; `card`/`card-body`/`card-title` → `zui-card`/`zui-card-body`/`zui-card-title`; `form-control` → `zui-input`; `form-label` → `zui-label`; `badge bg-*` → `zui-badge zui-badge-color-*`; `modal` → `zui-dialog`; `nav-tabs` → `zui-tabs`; `table` → `zui-table`; `d-flex`/`justify-content-between`/`align-items-center` → `flex`/`justify-between`/`items-center`; `mb-3` → `mb-xs`; `visually-hidden` → `visually-hidden`. The grid (`row`/`col-*`) has no ZUI equivalent — replace with CSS grid or flex utilities.

## Filling the gaps

ZUI has no Switch, Alert, Toast, Skeleton, Progress, Slider, Combobox, Command palette, Date picker, or Carousel. Options, in order of preference:

1. **Native element + tokens.** Many gaps are a styled native element: Progress → `<progress>`, Switch → a checkbox styled as a track/thumb, Alert → a `div[role="alert"]` built from `--color-error` / `--color-warning` + `--radius-md` + `--space-*`.
2. **Keep a headless library, restyle it with ZUI tokens.** Radix, Ark UI, Base UI, TanStack, react-hook-form, and Sonner are unstyled or theme-able — keep the behaviour, swap the styling for ZUI tokens and component variables. This is the right answer for Combobox, Command, Date picker, and Toast.
3. **Write a new component in the ZUI style.** CSS in `@layer zui.components` with a `zui-` prefixed class and `--zui-<name>-*` custom properties for its knobs. If the component belongs in ZUI itself rather than the app, it needs the full multi-layer treatment (CSS + every framework wrapper + shared `cva` variants + docs) — see `AGENTS.md`.

Whichever route: no inline SVG (use Phosphor), no hard-coded colours or spacing, and the component's knobs are custom properties, not props that emit inline styles.

## Anti-patterns

| Anti-pattern | Do instead |
|---|---|
| Recreating the old library's utility classes on top of ZUI | Use ZUI components + utilities; write scoped CSS for the rest |
| `@apply`-ing ZUI classes into a wrapper class | Use the class or component directly |
| A `<Button>` wrapper that maps old prop names to new ones, kept forever | Temporary shim only; delete once call sites are migrated |
| `!important` to make a migrated component win | Fix the layering — unlayered project CSS already beats `zui.components`; the real problem is a stale old rule that should be deleted |
| Overriding `color` / `background-color` / `padding` on a ZUI component | Override the component's variable (`--zui-btn-fg`, `--zui-card-padding`) |
| Adding tokens to preserve the old pixel scale | Snap to the nearest ZUI step; the scales are fluid by design |
| Migrating every screen in one PR | One component (or one route) per PR — the two libraries coexist safely |
| Leaving the old library installed "just in case" | Uninstall it; git has the history |
