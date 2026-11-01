/**
 * Design-system oracle. Checks the rules in intent/design-system.md (repo root)
 * against the real CSS AST (lightningcss) and the real cva configs.
 *
 * If a check fails, either the change is wrong or the rule should change.
 * Change the rule in intent/ first, deliberately, then the check. Don't add to
 * a KNOWN_* baseline list to make a new failure pass; those lists record debt
 * that existed when the rule was written, and should only shrink.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { transform } from 'lightningcss'
import { describe, expect, test, vi } from 'vitest'

// ---------- capture every cva() config as the shared modules load ----------

type CvaConfig = {
  base?: unknown
  variants?: Record<string, Record<string, unknown>>
  defaultVariants?: Record<string, unknown>
  compoundVariants?: Record<string, unknown>[]
}
const cvaConfigs = vi.hoisted(() => [] as { config: unknown }[])

vi.mock('cva', async (importOriginal) => {
  const real = await importOriginal<typeof import('cva')>()
  return {
    ...real,
    cva: (config: unknown) => {
      cvaConfigs.push({ config })
      return (real.cva as (c: unknown) => unknown)(config)
    },
  }
})

// ---------- helpers ----------

const PKG = join(import.meta.dirname, '..', '..')
const ROOT = join(PKG, '..', '..')
const CSS_DIR = join(PKG, 'src', 'css')
const COMPONENT_CSS_DIR = join(CSS_DIR, 'components')

// Load every shared variants module; the cva mock above records each config.
const SHARED_DIR = join(PKG, 'src', 'shared')
const sharedModules = await Promise.all(
  readdirSync(SHARED_DIR)
    .filter((f) => f.endsWith('Variants.ts'))
    .map((f) => import(join(SHARED_DIR, f))),
)

function walk(dir: string, ext: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return walk(full, ext)
    return full.endsWith(ext) ? [full] : []
  })
}

const classTokens = (value: unknown): string[] => {
  if (typeof value === 'string') return value.split(/\s+/).filter(Boolean)
  if (Array.isArray(value)) return value.flatMap(classTokens)
  return []
}

type Sel = { type: string; name?: string; selectors?: Sel[][] }
/** isBaseRule: the selector is a single class and nothing else (`.zui-card`). */
type StyleRule = {
  file: string
  compound: string[]
  customProps: string[]
  isBaseRule: boolean
}

/** Every class name mentioned in a selector, including inside :not()/:is(). */
function classesIn(selector: Sel[]): string[] {
  return selector.flatMap((c) => [
    ...(c.type === 'class' && c.name ? [c.name] : []),
    ...(c.selectors ?? []).flatMap(classesIn),
  ])
}

/** Classes on the subject (last compound) of a selector, ignoring pseudo args. */
function subjectClasses(selector: Sel[]): string[] {
  const out: string[] = []
  for (const c of selector) {
    if (c.type === 'combinator') out.length = 0
    else if (c.type === 'class' && c.name) out.push(c.name)
  }
  return out
}

const allClasses = new Set<string>()
const rules: StyleRule[] = []

for (const file of walk(CSS_DIR, '.css')) {
  transform({
    code: readFileSync(file),
    filename: file,
    visitor: {
      Rule: {
        style(rule) {
          // Narrow to the fields the oracle reads; lightningcss's own types
          // are a deep union that adds nothing here.
          const value = rule.value as unknown as {
            selectors: Sel[][]
            declarations: {
              declarations: { property: string; value: { name: string } }[]
            }
          }
          const customProps = value.declarations.declarations
            .filter((d) => d.property === 'custom')
            .map((d) => d.value.name)
          for (const sel of value.selectors) {
            for (const c of classesIn(sel)) allClasses.add(c)
            rules.push({
              compound: subjectClasses(sel),
              customProps,
              file: relative(PKG, file),
              isBaseRule: sel.length === 1 && sel[0]?.type === 'class',
            })
          }
          return undefined
        },
      },
    },
  })
}

const configs = cvaConfigs.map((c) => c.config as CvaConfig)

// ---------- rules ----------

describe('intent/design-system.md', () => {
  test('sanity: the oracle loaded the CSS and the cva configs', () => {
    expect(sharedModules.length).toBeGreaterThan(10)
    expect(configs.length).toBeGreaterThan(10)
    expect(allClasses.has('zui-button')).toBe(true)
  })

  test('D1 every class a cva variant can emit exists in the CSS', () => {
    const missing: string[] = []
    for (const cfg of configs) {
      const emitted = [
        ...classTokens(cfg.base),
        ...Object.values(cfg.variants ?? {}).flatMap((values) =>
          Object.values(values).flatMap(classTokens),
        ),
        ...(cfg.compoundVariants ?? []).flatMap((cv) =>
          classTokens(cv.class ?? cv.className),
        ),
      ]
      for (const cls of emitted) {
        if (!allClasses.has(cls))
          missing.push(`${classTokens(cfg.base)[0] ?? '?'}: .${cls}`)
      }
    }
    expect([...new Set(missing)].sort()).toEqual(KNOWN_MISSING_CLASSES)
  })

  test('D2 a component base rule never sets its public --zui-* knobs', () => {
    const bases = new Set(
      configs.flatMap((c) => classTokens(c.base).slice(0, 1)),
    )
    const offenders = rules
      .filter((r) => r.isBaseRule && bases.has(r.compound[0] ?? ''))
      .flatMap((r) =>
        r.customProps
          .filter((p) => p.startsWith('--zui-'))
          .map((p) => `${r.file}: .${r.compound[0]} sets ${p}`),
      )
    expect([...new Set(offenders)].sort()).toEqual([])
  })

  test('D3 the class for a default variant never sets a public --zui-* knob', () => {
    const offenders: string[] = []
    for (const cfg of configs) {
      for (const [key, value] of Object.entries(cfg.defaultVariants ?? {})) {
        const defaultClasses = classTokens(cfg.variants?.[key]?.[String(value)])
        for (const cls of defaultClasses) {
          for (const r of rules) {
            if (!r.compound.includes(cls)) continue
            for (const p of r.customProps.filter((p) =>
              p.startsWith('--zui-'),
            )) {
              offenders.push(
                `${r.file}: default ${key}=${String(value)} (.${cls}) sets ${p}`,
              )
            }
          }
        }
      }
    }
    expect([...new Set(offenders)].sort()).toEqual([])
  })

  test('D4 component CSS lives in @layer zui.components and uses no raw colours', () => {
    const problems: string[] = []
    for (const file of walk(COMPONENT_CSS_DIR, '.css')) {
      const src = readFileSync(file, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '')
      const name = basename(file)
      if (!/@layer\s+zui\.components\b/.test(src))
        problems.push(`${name}: no @layer zui.components`)
      for (const m of src.matchAll(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(/gi)) {
        problems.push(`${name}: raw colour ${m[0]}`)
      }
    }
    expect(problems).toEqual([])
  })

  test('D5 every component is exported from all five framework entry points', () => {
    const FRAMEWORKS = ['astro', 'react', 'solid', 'svelte', 'vue'] as const
    /** PascalCase value exports, minus non-component helpers. */
    const componentsExported = (fw: (typeof FRAMEWORKS)[number]) => {
      const index = readFileSync(join(PKG, 'src', fw, 'index.ts'), 'utf-8')
      return new Set(
        [...index.matchAll(/export\s*\{([^}]*)\}/g)]
          .flatMap((m) => (m[1] ?? '').split(','))
          .map((s) => s.trim())
          .filter((s) => s && !s.startsWith('type '))
          .map((s) =>
            s.replace(/^default\s+as\s+/, '').replace(/^\w+\s+as\s+/, ''),
          )
          .filter((s) => /^[A-Z]/.test(s) && !s.endsWith('Controller'))
          .map((s) => EXPORT_RENAMES[fw]?.[s] ?? s),
      )
    }
    const byFw = new Map(FRAMEWORKS.map((fw) => [fw, componentsExported(fw)]))
    const all = new Set(FRAMEWORKS.flatMap((fw) => [...(byFw.get(fw) ?? [])]))
    const gaps: string[] = []
    for (const fw of FRAMEWORKS) {
      for (const n of all)
        if (!byFw.get(fw)?.has(n)) gaps.push(`${fw}: ${n} not exported`)
    }
    expect(all.size).toBeGreaterThan(30)
    expect(gaps.sort()).toEqual(KNOWN_WRAPPER_GAPS)
  })

  test('D6 every public --zui-* knob a component reads is documented', () => {
    const docs = walk(join(ROOT, 'docs', 'src', 'pages'), '.mdx')
      .map((f) => readFileSync(f, 'utf-8'))
      .join('\n')
    const undocumented = new Set<string>()
    for (const file of walk(COMPONENT_CSS_DIR, '.css')) {
      const src = readFileSync(file, 'utf-8')
      for (const m of src.matchAll(/var\(\s*(--zui-[a-z0-9-]+)/g)) {
        if (m[1] && !docs.includes(m[1]))
          undocumented.add(`${basename(file)}: ${m[1]}`)
      }
    }
    expect([...undocumented].sort()).toEqual(KNOWN_UNDOCUMENTED_KNOBS)
  })
})

// ---------- baselines: debt that existed when the rules were written ----------
// Shrink these by fixing the gap. Never grow them to get a check passing.

/** Deliberate per-framework export names. See intent/decisions/0002. */
const EXPORT_RENAMES: Partial<Record<string, Record<string, string>>> = {
  svelte: { ZuiLink: 'Link' },
  vue: { ZuiLink: 'Link' },
}

const KNOWN_MISSING_CLASSES: string[] = []
const KNOWN_WRAPPER_GAPS: string[] = []
const KNOWN_UNDOCUMENTED_KNOBS: string[] = []
