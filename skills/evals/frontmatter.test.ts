import { describe, expect, it } from 'vitest'
import { rel } from './lib/paths'
import { skills } from './lib/skills'

/**
 * Frontmatter drives whether a skill is offered at all — a malformed or vague
 * description means the skill never fires, which no output eval would catch.
 */
describe.each(skills)('$name frontmatter', (skill) => {
  it('name matches the directory', () => {
    expect(skill.frontmatter.name, rel(skill.path)).toBe(skill.name)
  })

  it('has a description', () => {
    expect(skill.frontmatter.description ?? '').not.toBe('')
  })

  it('description fits the 1024-character limit', () => {
    expect(skill.frontmatter.description.length).toBeLessThanOrEqual(1024)
  })

  it('description lists trigger keywords', () => {
    // The house convention: end the description with `Triggers on: …` so the
    // matcher has concrete surface forms, not just a topic summary.
    expect(skill.frontmatter.description).toMatch(/Triggers on:/)
  })

  it('is marked user-invocable', () => {
    expect(skill.frontmatter['user-invocable']).toBe('true')
  })

  it('has exactly one h1', () => {
    // Fences are stripped first — a `# comment` in a shell block is not a
    // heading.
    const prose = skill.body.replace(/^```[\s\S]*?^```/gm, '')
    expect(prose.match(/^# .+$/gm) ?? []).toHaveLength(1)
  })
})
