import { converter, formatHex } from 'culori'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ClassEntry {
  name: string
  source: string
}

export interface TokenEntry {
  name: string
  value: string
  category: string
  /** Pre-computed hex colour for swatch preview, where resolvable */
  color?: string
}

export interface Manifest {
  version: string
  classes: ClassEntry[]
  tokens: TokenEntry[]
}

/** A CSS source file: `name` is the basename without the `.css` extension. */
export interface CssFile {
  name: string
  css: string
}

/** The `src/css` tree of a ZUI package, read from disk by the caller. */
export interface ManifestSources {
  version: string
  /** src/css/components/*.css */
  components: CssFile[]
  /** src/css/tokens/*.css */
  tokens: CssFile[]
  /** src/css/theme.css */
  theme?: string
  /** src/css/utilities/*.css */
  utilities: CssFile[]
}

// ─── Colour resolution ───────────────────────────────────────────────────────

const toRgb = converter('rgb')

/**
 * Resolve a CSS colour value to hex where possible.
 * Handles any format culori can parse (hex, oklch, hsl, lab, etc.).
 * Skips: light-dark(), relative oklch (from …), var(), clamp()
 */
function resolveColor(value: string): string | null {
  const trimmed = value.trim()
  // Skip values culori can't meaningfully parse (CSS functions, relative syntax)
  if (/\b(var|from|light-dark|clamp)\s*\(/.test(trimmed)) return null
  try {
    const rgb = toRgb(trimmed)
    if (!rgb) return null
    return formatHex(rgb)
  } catch {
    return null
  }
}

// ─── CSS parsers ─────────────────────────────────────────────────────────────

function extractZuiClasses(css: string, source: string): ClassEntry[] {
  const seen = new Set<string>()
  const entries: ClassEntry[] = []
  const re = /\.(zui-[\w-]+)/g
  for (const match of css.matchAll(re)) {
    const name = match[1]
    if (seen.has(name)) continue
    seen.add(name)
    entries.push({ name, source })
  }
  return entries
}

function extractUtilityClasses(css: string, source: string): ClassEntry[] {
  const seen = new Set<string>()
  const entries: ClassEntry[] = []
  // Match selector chains (e.g. `.prose.inverted`) that aren't part of a
  // dotted identifier like `@layer zui.utilities`. The lookbehind rejects a
  // leading `.` preceded by a word char. Each `.`-separated segment is then
  // extracted as its own class name.
  const re = /(?<![\w])(\.([\w-]+))+(?=[\s{,:])/g
  for (const match of css.matchAll(re)) {
    const chain = match[0]
    for (const seg of chain.split('.')) {
      if (!seg || seg.startsWith('zui-') || seen.has(seg)) continue
      seen.add(seg)
      entries.push({ name: seg, source: `utility/${source}` })
    }
  }
  return entries
}

function extractTokens(css: string, category: string): TokenEntry[] {
  const seen = new Set<string>()
  const tokens: TokenEntry[] = []
  // Match --name: value; — skip lines inside selectors (component custom props)
  const re = /^\s*--([\w-]+)\s*:\s*([^;{}\n]+);/gm
  for (const match of css.matchAll(re)) {
    const name = `--${match[1]}`
    if (seen.has(name)) continue
    seen.add(name)
    const value = match[2].trim()
    const entry: TokenEntry = { category, name, value }
    const color = resolveColor(value)
    if (color) entry.color = color
    tokens.push(entry)
  }
  return tokens
}

function categoryFromName(name: string): string {
  if (name.startsWith('color')) return 'color'
  return name
}

// ─── Builder ─────────────────────────────────────────────────────────────────

export function buildManifest(sources: ManifestSources): Manifest {
  const classes: ClassEntry[] = []
  const tokens: TokenEntry[] = []

  for (const file of sources.components) {
    classes.push(...extractZuiClasses(file.css, file.name))
  }

  for (const file of sources.tokens) {
    tokens.push(...extractTokens(file.css, categoryFromName(file.name)))
  }

  if (sources.theme) {
    tokens.push(...extractTokens(sources.theme, 'theme'))
  }

  for (const file of sources.utilities) {
    classes.push(...extractUtilityClasses(file.css, file.name))
  }

  // Dedup tokens globally — e.g. `--shadow-color` is declared in both a token
  // file and theme.css, and we want the first (token-file) definition to win.
  const tokenSeen = new Set<string>()
  const dedupedTokens = tokens.filter((t) => {
    if (tokenSeen.has(t.name)) return false
    tokenSeen.add(t.name)
    return true
  })

  return {
    classes,
    tokens: dedupedTokens,
    version: sources.version,
  }
}
