import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { read, rel, SKILLS_DIR } from './paths'
import { tokenNamespaces } from './source'

/**
 * Facts extracted from the SKILL.md files. Every reference keeps its line
 * number so a failing eval points at the exact line to fix.
 */

export const SKILL_NAMES = ['using-zui', 'zui-theme', 'migrate-to-zui'] as const
export type SkillName = (typeof SKILL_NAMES)[number]

export interface Reference<T = string> {
  value: T
  line: number
  /**
   * True when the skill wrote a family stem rather than a concrete name —
   * `zui-button-variant-{name}`, `--space-*`. These are checked by prefix.
   */
  wildcard: boolean
}

export interface ImportReference {
  spec: string
  names: string[]
  typeOnly: boolean
  line: number
}

export interface CodeBlock {
  lang: string
  code: string
  /** Line number of the opening fence. */
  line: number
}

export interface Skill {
  name: SkillName
  path: string
  /** Raw frontmatter lines, parsed shallowly (all values are strings). */
  frontmatter: Record<string, string>
  /** Everything after the closing `---`. */
  body: string
  codeBlocks: CodeBlock[]
  classRefs: Reference[]
  tokenRefs: Reference[]
  imports: ImportReference[]
  layerRefs: Reference[]
}

function lineAt(text: string, index: number): number {
  let line = 1
  for (let i = 0; i < index; i++) if (text[i] === '\n') line++
  return line
}

function parseFrontmatter(source: string): {
  frontmatter: Record<string, string>
  body: string
  bodyOffset: number
} {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { body: source, bodyOffset: 0, frontmatter: {} }
  const frontmatter: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/)
    if (!kv) continue
    frontmatter[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return {
    body: source.slice(match[0].length),
    bodyOffset: match[0].length,
    frontmatter,
  }
}

/**
 * A stem followed by `*`, `{` or `<` is a family placeholder, not a real name:
 * `zui-badge-color-*`, `zui-button-variant-{name}`, `--zui-<name>-*`.
 */
function isWildcardAt(text: string, end: number): boolean {
  const rest = text.slice(end, end + 2)
  return /^-?[*{<]/.test(rest)
}

const CLASS_RE = /(?<![\w\-/@.])(zui-[a-z0-9]+(?:-[a-z0-9]+)*)/g
// `-+` so negative steps (`--step--4`, `--z--1`) are read as one token.
const TOKEN_RE = /(?<![\w-])(--[a-z0-9]+(?:-+[a-z0-9]+)*)/g
const IMPORT_RE =
  /import\s+(type\s+)?(?:\{([^}]*)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
const LAYER_RE = /@layer\s+([\w.]+)\s*\{/g

function extract(
  body: string,
  offset: number,
  regex: RegExp,
  filter: (value: string) => boolean,
): Reference[] {
  const refs: Reference[] = []
  for (const match of body.matchAll(regex)) {
    const value = match[1]
    if (!filter(value)) continue
    const end = (match.index as number) + match[0].length
    refs.push({
      line: lineAt(body, match.index as number) + offset,
      value,
      wildcard: isWildcardAt(body, end),
    })
  }
  return refs
}

function loadSkill(name: SkillName): Skill {
  const path = join(SKILLS_DIR, name, 'SKILL.md')
  if (!existsSync(path)) throw new Error(`Missing skill file: ${rel(path)}`)
  const source = read(path)
  const { frontmatter, body, bodyOffset } = parseFrontmatter(source)
  const offset = lineAt(source, bodyOffset) - 1

  const codeBlocks: CodeBlock[] = [
    ...body.matchAll(/^```([a-z0-9]*)\n([\s\S]*?)^```/gm),
  ].map((match) => ({
    code: match[2],
    lang: match[1],
    line: lineAt(body, match.index as number) + offset,
  }))

  const imports: ImportReference[] = [...body.matchAll(IMPORT_RE)].map(
    (match) => ({
      line: lineAt(body, match.index as number) + offset,
      names: (match[2] ?? match[3] ?? '')
        .split(',')
        .map((entry) =>
          entry
            .replace(/^type\s+/, '')
            .split(/\s+as\s+/)[0]
            .trim(),
        )
        .filter(Boolean),
      spec: match[4],
      typeOnly: Boolean(match[1]),
    }),
  )

  return {
    body,
    // `zui-theme` and `zui` are package names, not classes.
    classRefs: extract(
      body,
      offset,
      CLASS_RE,
      (value) => value !== 'zui-theme' && value !== 'zui',
    ),
    codeBlocks,
    frontmatter,
    imports,
    layerRefs: extract(body, offset, LAYER_RE, () => true),
    name,
    path,
    // Only custom properties in a namespace ZUI actually owns are the skill's
    // responsibility — `--my-tooltip` in an anchor-positioning example is not.
    tokenRefs: extract(body, offset, TOKEN_RE, (value) =>
      tokenNamespaces.has(value.slice(2).split('-')[0]),
    ),
  }
}

export const skills: Skill[] = SKILL_NAMES.map(loadSkill)

export function skill(name: SkillName): Skill {
  const found = skills.find((s) => s.name === name)
  if (!found) throw new Error(`Unknown skill: ${name}`)
  return found
}

/** Every skill reference as `[skill, reference]` pairs, for table-driven tests. */
export function allRefs(
  pick: (skill: Skill) => Reference[],
): Array<{ skill: Skill; ref: Reference }> {
  return skills.flatMap((s) => pick(s).map((ref) => ({ ref, skill: s })))
}
