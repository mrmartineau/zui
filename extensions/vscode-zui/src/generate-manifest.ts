#!/usr/bin/env tsx
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { converter, formatHex } from 'culori'

const __dirname = dirname(fileURLToPath(import.meta.url))

const rootCssDir = join(__dirname, '../../../src/css')
const componentsDir = join(rootCssDir, 'components')
const tokensDir = join(rootCssDir, 'tokens')
const themeFile = join(rootCssDir, 'theme.css')
const utilitiesDir = join(rootCssDir, 'utilities')

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
  generatedAt: string
  classes: ClassEntry[]
  tokens: TokenEntry[]
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

function categoryFromFilename(file: string): string {
  const name = basename(file, '.css')
  if (name.startsWith('color')) return 'color'
  return name
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const classes: ClassEntry[] = []
const tokens: TokenEntry[] = []

for (const file of readdirSync(componentsDir).filter((f) =>
  f.endsWith('.css'),
)) {
  const css = readFileSync(join(componentsDir, file), 'utf-8')
  classes.push(...extractZuiClasses(css, basename(file, '.css')))
}

for (const file of readdirSync(tokensDir).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(join(tokensDir, file), 'utf-8')
  tokens.push(...extractTokens(css, categoryFromFilename(file)))
}

if (existsSync(themeFile)) {
  const css = readFileSync(themeFile, 'utf-8')
  tokens.push(...extractTokens(css, 'theme'))
}

if (existsSync(utilitiesDir)) {
  for (const file of readdirSync(utilitiesDir).filter((f) =>
    f.endsWith('.css'),
  )) {
    const css = readFileSync(join(utilitiesDir, file), 'utf-8')
    classes.push(...extractUtilityClasses(css, basename(file, '.css')))
  }
}

const rootPkg = JSON.parse(
  readFileSync(join(__dirname, '../../../package.json'), 'utf-8'),
) as { version: string }

// Dedup tokens globally — e.g. `--shadow-color` is declared in both a token
// file and theme.css, and we want the first (token-file) definition to win.
const tokenSeen = new Set<string>()
const dedupedTokens = tokens.filter((t) => {
  if (tokenSeen.has(t.name)) return false
  tokenSeen.add(t.name)
  return true
})

const manifest: Manifest = {
  classes,
  generatedAt: new Date().toISOString(),
  tokens: dedupedTokens,
  version: rootPkg.version,
}

const outPath = join(__dirname, 'manifest.json')
writeFileSync(outPath, JSON.stringify(manifest, null, 2))

const colorCount = dedupedTokens.filter((t) => t.color).length
console.log(
  `✓ manifest: ${classes.length} classes, ${dedupedTokens.length} tokens (${colorCount} with colour preview) → ${outPath}`,
)
