<div align="center">
  <img src="https://github.com/mrmartineau/zui/raw/main/zui-readme.png" alt="ZUI" width="400" />
</div>

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

The extension re-evaluates whenever any `package.json` in the workspace changes, so adding, removing, or upgrading ZUI as a dependency flips or refreshes completions without a reload.

## Configuration

| Setting      | Type                            | Default  | Description                                                                                       |
| ------------ | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `zui.enable` | `"auto" \| "always" \| "never"` | `"auto"` | `auto` activates only in workspaces that depend on `@mrmartineau/zui`. `always` forces IntelliSense on. `never` disables the extension. |

## How it works

The extension reads the copy of `@mrmartineau/zui` installed in the workspace's `node_modules` (the published package ships its source CSS) and parses every class and token name from it, so completions always match the ZUI version the project actually depends on. It re-parses whenever a workspace `package.json` changes, so upgrading ZUI refreshes completions without a reload.

When no installed copy can be found — e.g. `zui.enable: "always"` in a project that uses ZUI via CDN — it falls back to a bundled manifest snapshot generated from the latest ZUI release at extension build time.

## Links

- [ZUI on GitHub](https://github.com/mrmartineau/zui)
- [ZUI documentation](https://zui.zander.wtf)
- [Report an issue](https://github.com/mrmartineau/zui/issues)

## License

MIT
