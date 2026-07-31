import { describe, expect, it } from 'vitest'
import {
  INTERNAL_CSS_COMPONENTS,
  UNDOCUMENTED_COMPONENTS,
  UNDOCUMENTED_THEME_EXPORTS,
} from './lib/allowlist'
import { skill } from './lib/skills'
import { barrels, componentNames, cssComponentFiles } from './lib/source'

/**
 * Drift detector, and the reason these evals exist: adding a component to the
 * library without documenting it in the skill means the model keeps
 * hand-rolling the thing ZUI already ships. Nothing else in the repo catches
 * that.
 */

const usingZui = skill('using-zui')
const themeSkill = skill('zui-theme')

describe('using-zui covers the library', () => {
  it('documents every exported component', () => {
    const undocumented = [...componentNames]
      .filter((name) => !(name in UNDOCUMENTED_COMPONENTS))
      // Word-boundary match so `Card` isn't satisfied by `CardBody`.
      .filter((name) => !new RegExp(`\\b${name}\\b`).test(usingZui.body))

    expect(undocumented).toEqual([])
  })

  it('documents every CSS component', () => {
    const referenced = new Set(usingZui.classRefs.map((ref) => ref.value))
    const undocumented = cssComponentFiles
      .filter(({ name }) => !(name in INTERNAL_CSS_COMPONENTS))
      .filter(({ name }) => {
        for (const value of referenced) {
          if (value === `zui-${name}` || value.startsWith(`zui-${name}-`))
            return false
        }
        return true
      })
      .map(({ name }) => `${name}.css`)

    expect(undocumented).toEqual([])
  })
})

describe('zui-theme covers the theme package', () => {
  it('documents every component exported from @mrmartineau/zui-theme/astro', () => {
    const barrel = barrels.get('@mrmartineau/zui-theme/astro')
    expect(barrel).toBeDefined()

    const undocumented = [...(barrel?.values ?? [])]
      .filter((name) => /^[A-Z]/.test(name))
      .filter((name) => !(name in UNDOCUMENTED_THEME_EXPORTS))
      .filter((name) => !new RegExp(`\\b${name}\\b`).test(themeSkill.body))

    expect(undocumented).toEqual([])
  })
})
