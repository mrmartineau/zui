# Shared vanilla JS controllers for cross-framework component logic

## Status

accepted

## Context

The `AppShell` component requires non-trivial runtime logic that cannot be expressed in CSS alone: `ResizeObserver` to detect crossing the mobile breakpoint, `popover` API calls to swap sidebar between desktop and drawer presentations, `localStorage` persistence of collapse state, and an opt-in `Cmd/Ctrl+B` keyboard shortcut. Prior to this component, `packages/zui/src/shared/` contained only `cva` variant definitions — there was no precedent for shared runtime logic.

## Decision

A single vanilla TypeScript controller class (`AppShellController`) lives in `packages/zui/src/shared/` and is consumed by all five framework wrappers (Astro, React, Solid, Svelte, Vue). Wrappers stay thin: they instantiate the controller, bind reactive state to its events, and clean it up on unmount. The controller owns the `ResizeObserver`, `popover` calls, `localStorage` IO, and keyboard listener.

## Considered alternatives

- **Per-framework duplication.** Reimplement the logic as a React hook, Solid signal, Svelte rune, and Vue composable. Rejected because the logic is ~5 interacting concerns; duplicating five times invites drift and triples the surface area of bug fixes.
- **Pure CSS via `<details>` or hidden-checkbox.** Considered for desktop collapse, but mobile drawer requires JS for popover state sync on breakpoint crossings — so JS is needed regardless. Mixing two mechanisms (`<details>` on desktop, JS on mobile) is more complex than one.
- **Native `<dialog position-left>` reuse for the drawer.** Would require two DOM trees (static sidebar + dialog) or a portal. Rejected on semantic grounds (sidebar ≠ dialog) and on the user's explicit preference for a single DOM tree.

## Consequences

- Sets precedent: future ZUI components with cross-framework runtime logic should follow the same pattern rather than reimplementing per framework.
- Framework wrappers gain a small lifecycle responsibility (instantiate / dispose the controller). This is acceptable boilerplate; tests cover wrapper lifecycle.
- Tree-shaking: consumers who only use CSS-only components (Button, Card, Badge, etc.) never pull in `AppShellController`. Wrappers import lazily.
- The animation/visual slide-in for the mobile drawer is extracted from `zui-dialog-position-left|right` into a shared `zui-drawer-slide-left|right` class so the dialog component and the app shell sidebar render visually identical drawers without coupling their controllers.
