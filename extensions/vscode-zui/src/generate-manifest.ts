#!/usr/bin/env tsx
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

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

// ─── oklch → hex ─────────────────────────────────────────────────────────────

function oklchToHex(l: number, c: number, h: number): string | null {
  try {
    const hRad = (h * Math.PI) / 180
    const a = c * Math.cos(hRad)
    const b = c * Math.sin(hRad)

    const l_ = l + 0.3963377774 * a + 0.2158037573 * b
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b

    const lc = l_ * l_ * l_
    const mc = m_ * m_ * m_
    const sc = s_ * s_ * s_

    const r = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
    const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
    const bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc

    const toSRGB = (x: number): number => {
      const cl = Math.max(0, Math.min(1, x))
      return cl <= 0.0031308 ? 12.92 * cl : 1.055 * cl ** (1 / 2.4) - 0.055
    }

    const toHex = (x: number): string =>
      Math.round(x * 255).toString(16).padStart(2, '0')

    return `#${toHex(toSRGB(r))}${toHex(toSRGB(g))}${toHex(toSRGB(bv))}`
  } catch {
    return null
  }
}

/**
 * Resolve a CSS colour value to hex where possible.
 * Handles: oklch(L% C H), #hex
 * Skips: light-dark(), relative oklch (from var(...)), var(), clamp()
 */
function resolveColor(value: string): string | null {
  const trimmed = value.trim()

  // Simple hex
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed

  // Simple oklch(L% C H) — no relative syntax, no alpha, no custom props
  const oklchMatch = trimmed.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/
  )
  if (oklchMatch) {
    const l = parseFloat(oklchMatch[1]) / (oklchMatch[2] === '%' ? 100 : 1)
    const c = parseFloat(oklchMatch[3])
    const h = parseFloat(oklchMatch[4])
    return oklchToHex(l, c, h)
  }

  return null
}

// ─── CSS parsers ─────────────────────────────────────────────────────────────

function extractZuiClasses(css: string, source: string): ClassEntry[] {
  const seen = new Set<string>()
  const entries: ClassEntry[] = []
  const re = /\.(zui-[\w-]+)/g
  let match
  while ((match = re.exec(css)) !== null) {
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
  // Match class selectors that are NOT zui- prefixed, not pseudo-classes/elements
  const re = /\.((?!zui-)[\w-]+)(?=\s*[{,\s:])/g
  let match
  while ((match = re.exec(css)) !== null) {
    const name = match[1]
    if (seen.has(name)) continue
    seen.add(name)
    entries.push({ name, source: `utility/${source}` })
  }
  return entries
}

function extractTokens(css: string, category: string): TokenEntry[] {
  const seen = new Set<string>()
  const tokens: TokenEntry[] = []
  // Match --name: value; — skip lines inside selectors (component custom props)
  const re = /^\s*--([\w-]+)\s*:\s*([^;{}\n]+);/gm
  let match
  while ((match = re.exec(css)) !== null) {
    const name = `--${match[1]}`
    if (seen.has(name)) continue
    seen.add(name)
    const value = match[2].trim()
    const entry: TokenEntry = { name, value, category }
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

for (const file of readdirSync(componentsDir).filter(f => f.endsWith('.css'))) {
  const css = readFileSync(join(componentsDir, file), 'utf-8')
  classes.push(...extractZuiClasses(css, basename(file, '.css')))
}

for (const file of readdirSync(tokensDir).filter(f => f.endsWith('.css'))) {
  const css = readFileSync(join(tokensDir, file), 'utf-8')
  tokens.push(...extractTokens(css, categoryFromFilename(file)))
}

if (existsSync(themeFile)) {
  const css = readFileSync(themeFile, 'utf-8')
  tokens.push(...extractTokens(css, 'theme'))
}

if (existsSync(utilitiesDir)) {
  for (const file of readdirSync(utilitiesDir).filter(f => f.endsWith('.css'))) {
    const css = readFileSync(join(utilitiesDir, file), 'utf-8')
    classes.push(...extractUtilityClasses(css, basename(file, '.css')))
  }
}

const rootPkg = JSON.parse(
  readFileSync(join(__dirname, '../../../package.json'), 'utf-8')
) as { version: string }

const manifest: Manifest = {
  version: rootPkg.version,
  generatedAt: new Date().toISOString(),
  classes,
  tokens,
}

const outPath = join(__dirname, 'manifest.json')
writeFileSync(outPath, JSON.stringify(manifest, null, 2))

const colorCount = tokens.filter(t => t.color).length
console.log(
  `✓ manifest: ${classes.length} classes, ${tokens.length} tokens (${colorCount} with colour preview) → ${outPath}`
)
