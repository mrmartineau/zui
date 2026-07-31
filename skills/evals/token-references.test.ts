import { describe, expect, it } from 'vitest'
import { ALLOWED_MISSING_TOKENS } from './lib/allowlist'
import { allRefs } from './lib/skills'
import { tokens } from './lib/source'

/**
 * Design tokens and component custom properties are the whole customisation
 * surface ZUI exposes — a skill naming one that doesn't exist produces CSS that
 * silently does nothing.
 *
 * Only tokens in a namespace ZUI declares are checked (see `skills.ts`), so
 * author-invented properties in examples don't register as failures.
 */

const refs = allRefs((skill) => skill.tokenRefs)
const concrete = refs.filter(({ ref }) => !ref.wildcard)
const families = refs.filter(({ ref }) => ref.wildcard)

describe('token references', () => {
  it('finds tokens to check', () => {
    expect(concrete.length).toBeGreaterThan(50)
  })

  it('every referenced token is declared in the CSS', () => {
    const missing = concrete
      .filter(
        ({ ref }) =>
          !tokens.has(ref.value) && !(ref.value in ALLOWED_MISSING_TOKENS),
      )
      .map(
        ({ skill, ref }) => `${skill.name}/SKILL.md:${ref.line} — ${ref.value}`,
      )

    expect(missing).toEqual([])
  })

  it('every token family stem has at least one real member', () => {
    const orphaned = families
      .filter(({ ref }) => {
        if (ref.value in ALLOWED_MISSING_TOKENS) return false
        if (tokens.has(ref.value)) return false
        const prefix = `${ref.value}-`
        for (const candidate of tokens) {
          if (candidate.startsWith(prefix)) return false
        }
        return true
      })
      .map(
        ({ skill, ref }) =>
          `${skill.name}/SKILL.md:${ref.line} — ${ref.value}-*`,
      )

    expect(orphaned).toEqual([])
  })
})
