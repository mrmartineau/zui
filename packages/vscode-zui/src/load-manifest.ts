import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { buildManifest, type CssFile, type Manifest } from './manifest.js'

function readCssDir(dir: string): CssFile[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => ({
      css: readFileSync(join(dir, f), 'utf-8'),
      name: basename(f, '.css'),
    }))
}

/**
 * Build a manifest from a ZUI package directory on disk — either the
 * `packages/zui` source in this repo or an installed
 * `node_modules/@mrmartineau/zui` (the published package ships `src/css`).
 * Returns null when the directory doesn't contain a readable ZUI package.
 */
export function loadManifestFromPackageDir(pkgDir: string): Manifest | null {
  try {
    const pkg = JSON.parse(
      readFileSync(join(pkgDir, 'package.json'), 'utf-8'),
    ) as { version?: string }
    const cssRoot = join(pkgDir, 'src/css')
    const themeFile = join(cssRoot, 'theme.css')

    const manifest = buildManifest({
      components: readCssDir(join(cssRoot, 'components')),
      theme: existsSync(themeFile)
        ? readFileSync(themeFile, 'utf-8')
        : undefined,
      tokens: readCssDir(join(cssRoot, 'tokens')),
      utilities: readCssDir(join(cssRoot, 'utilities')),
      version: pkg.version ?? 'unknown',
    })

    // A package with no extractable classes or tokens isn't usable ZUI CSS.
    if (manifest.classes.length === 0 && manifest.tokens.length === 0) {
      return null
    }
    return manifest
  } catch {
    return null
  }
}
