import { describe, expect, it } from 'vitest'
import { skills } from './lib/skills'
import { barrels, FRAMEWORK_SPECS, resolvesToExport } from './lib/source'

/**
 * Import examples are copied verbatim more often than any other part of a
 * skill. A wrong subpath or a component that isn't exported from a given
 * framework barrel is an immediate build error in the consumer's project.
 */

const zuiImports = skills.flatMap((skill) =>
  skill.imports
    .filter((ref) => ref.spec.startsWith('@mrmartineau/'))
    .map((ref) => ({ ref, skill })),
)

describe('import examples', () => {
  it('finds imports to check', () => {
    expect(zuiImports.length).toBeGreaterThan(5)
  })

  it('every specifier resolves to a declared package export', () => {
    const unresolved = zuiImports
      .filter(({ ref }) => !resolvesToExport(ref.spec))
      .map(
        ({ skill, ref }) => `${skill.name}/SKILL.md:${ref.line} — ${ref.spec}`,
      )

    expect(unresolved).toEqual([])
  })

  it('every named import exists in that barrel', () => {
    const missing: string[] = []
    for (const { skill, ref } of zuiImports) {
      const barrel = barrels.get(ref.spec)
      // Specifiers with no source barrel (deep paths like `/astro/Button.astro`)
      // are covered by the export-resolution test above.
      if (!barrel) continue
      for (const name of ref.names) {
        if (barrel.values.has(name) || barrel.types.has(name)) continue
        missing.push(
          `${skill.name}/SKILL.md:${ref.line} — ${name} from ${ref.spec}`,
        )
      }
    }

    expect(missing).toEqual([])
  })
})

describe('framework parity', () => {
  it('every component the skills import is available in all five frameworks', () => {
    // Components named in one framework's example are routinely swapped for
    // another framework by the model, so an asymmetric barrel is a real trap.
    const referenced = new Set(
      zuiImports
        .filter(({ ref }) => FRAMEWORK_SPECS.includes(ref.spec as never))
        .flatMap(({ ref }) => ref.names)
        .filter((name) => /^[A-Z]/.test(name)),
    )
    expect(referenced.size).toBeGreaterThan(0)

    const gaps: string[] = []
    for (const name of referenced) {
      for (const spec of FRAMEWORK_SPECS) {
        const barrel = barrels.get(spec)
        if (!barrel?.values.has(name)) gaps.push(`${name} missing from ${spec}`)
      }
    }

    expect(gaps).toEqual([])
  })
})
