import { describe, expect, it } from 'vitest'
import { ALLOWED_MISSING_CLASSES } from './lib/allowlist'
import { allRefs } from './lib/skills'
import { allClasses } from './lib/source'

/**
 * Every `zui-*` class a skill tells the model to write must exist in the
 * library. A class that was renamed or dropped turns the skill into a
 * confident source of dead markup.
 */

const refs = allRefs((skill) => skill.classRefs)
const concrete = refs.filter(({ ref }) => !ref.wildcard)
const families = refs.filter(({ ref }) => ref.wildcard)

describe('class references', () => {
  it('finds classes to check', () => {
    expect(concrete.length).toBeGreaterThan(50)
  })

  it('every referenced class exists in the library', () => {
    const missing = concrete
      .filter(
        ({ ref }) =>
          !allClasses.has(ref.value) && !(ref.value in ALLOWED_MISSING_CLASSES),
      )
      .map(
        ({ skill, ref }) =>
          `${skill.name}/SKILL.md:${ref.line} — .${ref.value}`,
      )

    expect(missing).toEqual([])
  })

  it('every class family stem has at least one real member', () => {
    const orphaned = families
      .filter(({ ref }) => {
        if (ref.value in ALLOWED_MISSING_CLASSES) return false
        const prefix = `${ref.value}-`
        for (const candidate of allClasses) {
          if (candidate.startsWith(prefix)) return false
        }
        return true
      })
      .map(
        ({ skill, ref }) =>
          `${skill.name}/SKILL.md:${ref.line} — .${ref.value}-*`,
      )

    expect(orphaned).toEqual([])
  })
})
