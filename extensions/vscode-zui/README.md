# ZUI — VS Code Extension

IntelliSense for [ZUI](https://github.com/mrmartineau/zui), the CSS-first UI library.

Get autocomplete, documentation, and colour previews for every ZUI class and design token directly in your editor.

## Features

### Class autocomplete

Type inside a `class`, `className`, or `:class` attribute and get suggestions for every ZUI component class and utility class.

Works in:

- HTML
- JSX / TSX
- Astro
- Vue

### Design token autocomplete

Type `var(--` or `: --` in any CSS context and get suggestions for every ZUI design token — colours, spacing, radii, shadows, font sizes, z-indexes, easing, and more.

Works in:

- CSS, SCSS, Less
- Inline `style` attributes
- CSS-in-JS string contexts

### Colour swatches

ZUI colour tokens appear with inline colour swatches wherever they are used. The extension pre-resolves `oklch()` values to sRGB so swatches render correctly even in editors that don't natively support OKLCH.

## Activation

By default the extension only activates when it detects `@mrmartineau/zui` in a workspace `package.json` (under `dependencies`, `devDependencies`, or `peerDependencies`). If you install ZUI via a CDN or copy the CSS directly and want completions anyway, set `zui.enable` to `"always"`.

The extension re-evaluates whenever any `package.json` in the workspace changes, so adding or removing ZUI as a dependency flips completions on or off without a reload.

## Configuration

| Setting      | Type                            | Default  | Description                                                                                       |
| ------------ | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `zui.enable` | `"auto" \| "always" \| "never"` | `"auto"` | `auto` activates only in workspaces that depend on `@mrmartineau/zui`. `always` forces IntelliSense on. `never` disables the extension. |

## How it works

The extension ships with a pre-built manifest (`manifest.json`) generated from the ZUI source CSS at release time. The manifest contains every class and token name, so completions are instant and don't require any runtime CSS parsing.

Each release of the extension mirrors the latest ZUI release so completions always match the installed ZUI version.

## Links

- [ZUI on GitHub](https://github.com/mrmartineau/zui)
- [ZUI documentation](https://zui.mrmartineau.com)
- [Report an issue](https://github.com/mrmartineau/zui/issues)

## License

MIT
