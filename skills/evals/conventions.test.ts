import { describe, expect, it } from 'vitest'
import { skills } from './lib/skills'
import { cssComponentFiles, layers } from './lib/source'

/** `button`, `card`, `input`, … — the names a `zui-` prefix must guard. */
const componentBaseNames = new Set(cssComponentFiles.map(({ name }) => name))

/**
 * The house rules from CLAUDE.md / AGENTS.md, enforced against the skills that
 * teach them. A skill that violates a rule in its own examples teaches the
 * violation — examples outrank prose.
 */

const CSS_LANGS = new Set([
  'css',
  'scss',
  'astro',
  'html',
  'svelte',
  'vue',
  'jsx',
  'tsx',
])

describe.each(skills)('$name conventions', (skill) => {
  it('uses Phosphor icons, never inline SVG', () => {
    const offenders = skill.codeBlocks
      .filter((block) => /<svg[\s>]/i.test(block.code))
      .map((block) => `${skill.name}/SKILL.md:${block.line} (${block.lang})`)

    expect(offenders).toEqual([])
  })

  it('uses tokens, never hard-coded hex colours', () => {
    const offenders: string[] = []
    for (const block of skill.codeBlocks) {
      if (!CSS_LANGS.has(block.lang)) continue
      // `#` in a URL fragment or an id selector is fine; a hex triplet is not.
      for (const match of block.code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        offenders.push(`${skill.name}/SKILL.md:${block.line} — ${match[0]}`)
      }
    }

    expect(offenders).toEqual([])
  })

  it('only writes into declared cascade layers', () => {
    const unknown = skill.layerRefs
      .filter((ref) => !layers.includes(ref.value))
      .map((ref) => `${skill.name}/SKILL.md:${ref.line} — @layer ${ref.value}`)

    expect(unknown).toEqual([])
  })

  it('never defines an unprefixed class that shadows a ZUI component', () => {
    // A consumer's own selector (`.checkout .zui-button`) is fine; a rule for
    // `.button` or `.card` is the prefix rule being broken in an example.
    const offenders: string[] = []
    for (const block of skill.codeBlocks) {
      if (block.lang !== 'css') continue
      for (const match of block.code.matchAll(/\.([a-z][\w-]*)/g)) {
        const selector = match[1]
        if (selector.startsWith('zui-')) continue
        if (!componentBaseNames.has(selector)) continue
        offenders.push(`${skill.name}/SKILL.md:${block.line} — .${selector}`)
      }
    }

    expect(offenders).toEqual([])
  })
})

describe('cross-skill wiring', () => {
  it('migrate-to-zui points at using-zui for the API reference', () => {
    const migrate = skills.find((s) => s.name === 'migrate-to-zui')
    expect(migrate?.body).toMatch(/using-zui/)
  })
})
