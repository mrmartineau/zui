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
- Svelte templates (via HTML fallback)

### Design token autocomplete

Type `var(--` or `: --` in any CSS context and get suggestions for every ZUI design token — colours, spacing, radii, shadows, font sizes, z-indexes, easing, and more.

Works in:

- CSS, SCSS, Less
- Inline `style` attributes
- CSS-in-JS string contexts

### Colour swatches

ZUI colour tokens appear with inline colour swatches wherever they are used. The extension pre-resolves `oklch()` values to sRGB so swatches render correctly even in editors that don't natively support OKLCH.

## Configuration

| Setting      | Type      | Default | Description                |
| ------------ | --------- | ------- | -------------------------- |
| `zui.enable` | `boolean` | `true`  | Enable or disable ZUI IntelliSense. |

## How it works

The extension ships with a pre-built manifest (`manifest.json`) generated from the ZUI source CSS at release time. The manifest contains every class and token name, so completions are instant and don't require any runtime CSS parsing.

Each release of the extension mirrors the latest ZUI release so completions always match the installed ZUI version.

## Links

- [ZUI on GitHub](https://github.com/mrmartineau/zui)
- [ZUI documentation](https://zui.mrmartineau.com)
- [Report an issue](https://github.com/mrmartineau/zui/issues)

## License

MIT
