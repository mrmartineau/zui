import { join } from 'node:path'
import { ROOT, read, readJson, walk } from './paths'

/**
 * Ground truth extracted from the packages the skills document.
 *
 * Everything here is derived from source — never hand-maintained — so when a
 * component, class, token or export changes, these facts change with it and the
 * skill evals fail until the SKILL.md catches up.
 */

const PACKAGES = {
  '@mrmartineau/zui': join(ROOT, 'packages/zui'),
  '@mrmartineau/zui-theme': join(ROOT, 'packages/zui-theme'),
} as const

export type PackageName = keyof typeof PACKAGES

interface PackageJson {
  name: string
  exports: Record<string, unknown>
}

export interface BarrelExports {
  /** Import specifier, e.g. `@mrmartineau/zui/react`. */
  spec: string
  /** File the barrel was read from, relative to the repo root. */
  file: string
  /** Value exports (components, functions, cva variant helpers). */
  values: Set<string>
  /** Type-only exports. */
  types: Set<string>
}

const cssFiles = [
  ...walk(join(PACKAGES['@mrmartineau/zui'], 'src/css'), ['.css']),
  ...walk(join(PACKAGES['@mrmartineau/zui-theme'], 'src'), ['.css']),
]

const componentSourceFiles = [
  ...walk(join(PACKAGES['@mrmartineau/zui'], 'src'), [
    '.ts',
    '.tsx',
    '.astro',
    '.svelte',
    '.vue',
  ]),
  ...walk(join(PACKAGES['@mrmartineau/zui-theme'], 'src'), ['.ts', '.astro']),
].filter((file) => !file.endsWith('.test.ts'))

const cssText = cssFiles.map(read).join('\n')
const componentText = componentSourceFiles.map(read).join('\n')

/** `zui-*` classes with a rule in the CSS (`.zui-button`, `.zui-card-body`, …). */
export const cssClasses = new Set(
  [...cssText.matchAll(/\.(zui-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1]),
)

/**
 * `zui-*` classes emitted by component source. Covers classes assembled by
 * `cva` variants or template literals that never appear as a literal selector.
 */
export const emittedClasses = new Set(
  [
    ...componentText.matchAll(/(?<![\w\-/])(zui-[a-z0-9]+(?:-[a-z0-9]+)*)/g),
  ].map((m) => m[1]),
)

export const allClasses = new Set([...cssClasses, ...emittedClasses])

/**
 * Custom properties declared anywhere in the CSS (tokens + component vars).
 * The `-+` allows the double dash ZUI uses for negative steps (`--step--4`).
 */
export const tokens = new Set(
  [...cssText.matchAll(/(--[a-z0-9]+(?:-+[a-z0-9]+)*)\s*:/g)].map((m) => m[1]),
)

/**
 * First segment of every declared token (`--space-md` → `space`). Used to tell
 * "this token is in a ZUI namespace and must exist" apart from "this is the
 * author's own custom property in an example".
 */
export const tokenNamespaces = new Set(
  [...tokens].map((token) => token.slice(2).split('-')[0]),
)

/** Cascade layers declared by `layers.css`, in order. */
export const layers = (() => {
  const source = read(join(PACKAGES['@mrmartineau/zui'], 'src/css/layers.css'))
  const match = source.match(/@layer\s+([^;{]+);/)
  if (!match)
    throw new Error('Could not parse @layer declaration from layers.css')
  return match[1].split(',').map((name) => name.trim())
})()

/** Declared `exports` subpaths per package, e.g. `./react`, `./astro/*`. */
export const packageExports = new Map<PackageName, string[]>(
  (Object.keys(PACKAGES) as PackageName[]).map((name) => {
    const pkg = readJson<PackageJson>(join(PACKAGES[name], 'package.json'))
    return [name, Object.keys(pkg.exports)]
  }),
)

/**
 * Does `spec` resolve to a declared export subpath? Honours the single `*`
 * wildcard Node's exports field supports.
 */
export function resolvesToExport(spec: string): boolean {
  for (const [name, subpaths] of packageExports) {
    if (spec !== name && !spec.startsWith(`${name}/`)) continue
    const subpath = spec === name ? '.' : `.${spec.slice(name.length)}`
    for (const declared of subpaths) {
      if (declared === subpath) return true
      if (declared.includes('*')) {
        const [prefix, suffix] = declared.split('*')
        if (
          subpath.length > prefix.length + suffix.length &&
          subpath.startsWith(prefix) &&
          subpath.endsWith(suffix)
        ) {
          return true
        }
      }
    }
    return false
  }
  return false
}

const BARREL_FILES: Array<[spec: string, file: string]> = [
  ['@mrmartineau/zui/react', 'packages/zui/src/react/index.ts'],
  ['@mrmartineau/zui/astro', 'packages/zui/src/astro/index.ts'],
  ['@mrmartineau/zui/solid', 'packages/zui/src/solid/index.ts'],
  ['@mrmartineau/zui/svelte', 'packages/zui/src/svelte/index.ts'],
  ['@mrmartineau/zui/vue', 'packages/zui/src/vue/index.ts'],
  ['@mrmartineau/zui-theme/astro', 'packages/zui-theme/src/astro/index.ts'],
  ['@mrmartineau/zui-theme/nav', 'packages/zui-theme/src/nav.ts'],
]

/** Framework barrels that must expose the same component set. */
export const FRAMEWORK_SPECS = [
  '@mrmartineau/zui/react',
  '@mrmartineau/zui/astro',
  '@mrmartineau/zui/solid',
  '@mrmartineau/zui/svelte',
  '@mrmartineau/zui/vue',
] as const

function parseBarrel(spec: string, file: string): BarrelExports {
  const source = read(join(ROOT, file))
  const values = new Set<string>()
  const types = new Set<string>()

  for (const match of source.matchAll(/export\s+(type\s+)?\{([^}]*)\}/g)) {
    const blockIsTypeOnly = Boolean(match[1])
    for (const raw of match[2].split(',')) {
      const entry = raw.trim()
      if (!entry) continue
      const isType = blockIsTypeOnly || entry.startsWith('type ')
      const withoutType = entry.replace(/^type\s+/, '')
      // `default as Button` and `Foo as Bar` both export the trailing name.
      const name = withoutType
        .split(/\s+as\s+/)
        .pop()
        ?.trim()
      if (!name) continue
      ;(isType ? types : values).add(name)
    }
  }

  // `export const foo = …` / `export function foo` / `export class Foo`
  for (const match of source.matchAll(
    /export\s+(?:const|let|function|class)\s+(\w+)/g,
  )) {
    values.add(match[1])
  }
  for (const match of source.matchAll(/export\s+(?:type|interface)\s+(\w+)/g)) {
    types.add(match[1])
  }

  return { file, spec, types, values }
}

export const barrels = new Map<string, BarrelExports>(
  BARREL_FILES.map(([spec, file]) => [spec, parseBarrel(spec, file)]),
)

/**
 * Component names in the Astro barrel — the barrel with one export per
 * component and no cva/type noise, so it is the canonical component inventory.
 */
export const componentNames = new Set(
  [...(barrels.get('@mrmartineau/zui/astro')?.values ?? [])].filter((name) =>
    /^[A-Z]/.test(name),
  ),
)

/** Base class per CSS component file: `button.css` → `zui-button`. */
export const cssComponentFiles = walk(
  join(PACKAGES['@mrmartineau/zui'], 'src/css/components'),
  ['.css'],
).map((file) => {
  const basename = file.split('/').pop() as string
  return { file, name: basename.replace(/\.css$/, '') }
})
