/**
 * Builds the ZUI reference dataset (docs pages, CSS classes, design tokens,
 * framework snippets) from the docs MDX sources and the vscode-zui manifest.
 *
 * Pure module — no filesystem access. Consumed by:
 *  - `docs/src/pages/api/reference.json.ts` (build-time endpoint, via import.meta.glob)
 *  - `packages/raycast-zui/scripts/generate-data.ts` (bundled fallback snapshot, via fs)
 */

export const DOCS_BASE_URL = 'https://zui.zander.wtf'

export interface DocEntry {
  title: string
  description?: string
  section: string
  slug: string
  url: string
}

export interface ClassEntry {
  name: string
  source: string
  docsUrl?: string
}

export interface TokenEntry {
  name: string
  value: string
  category: string
  color?: string
  docsUrl?: string
}

export type Framework = 'html' | 'react' | 'astro' | 'solid' | 'svelte' | 'vue'

export interface SnippetEntry {
  id: string
  page: string
  pageUrl: string
  title: string
  frameworks: Partial<Record<Framework, string>>
}

export interface ReferenceData {
  schemaVersion: 1
  zuiVersion: string
  generatedAt: string
  docs: DocEntry[]
  classes: ClassEntry[]
  tokens: TokenEntry[]
  snippets: SnippetEntry[]
}

export interface Manifest {
  version: string
  classes: { name: string; source: string }[]
  tokens: { name: string; value: string; category: string; color?: string }[]
}

/** An MDX file, with `path` relative to `docs/src/pages` using `/` separators. */
export interface MdxSource {
  path: string
  source: string
}

// ─── Docs pages ──────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  components: 'Components',
  guides: 'Guides',
  integrations: 'Integrations',
  tokens: 'Tokens',
  utilities: 'Utilities',
}

function parseFrontmatter(source: string): Record<string, string> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!match) return {}
  const fields: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const kv = /^(\w[\w-]*):\s*(.+)$/.exec(line.trim())
    if (!kv) continue
    fields[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim()
  }
  return fields
}

function urlPathFor(relPath: string): string {
  const rel = relPath.replace(/\.mdx$/, '')
  const path =
    rel.endsWith('/index') || rel === 'index'
      ? rel.replace(/\/?index$/, '')
      : rel
  return `/${path}`.replace(/\/$/, '') || '/'
}

function buildDocs(files: MdxSource[]): DocEntry[] {
  const docs: DocEntry[] = []
  for (const file of files) {
    const frontmatter = parseFrontmatter(file.source)
    if (!frontmatter.title) continue
    const path = urlPathFor(file.path)
    const [, sectionKey] = path.split('/')
    docs.push({
      description: frontmatter.description,
      section: SECTION_LABELS[sectionKey] ?? 'Other',
      slug: path.split('/').filter(Boolean).join('/'),
      title: frontmatter.title,
      url: `${DOCS_BASE_URL}${path}`,
    })
  }
  return docs
}

// ─── Classes & tokens (from the vscode-zui manifest) ─────────────────────────

const UTILITY_DOCS_PAGES: Record<string, string> = {
  flex: 'flex',
  flow: 'flow',
  gap: 'spacing',
  hidden: 'visibility',
  margin: 'spacing',
  padding: 'spacing',
  prose: 'prose',
  'ui-typography': 'ui-typography',
}

const TOKEN_DOCS_PAGES: Record<string, string> = {
  animation: 'tokens/animation',
  aspect: 'tokens/aspect-ratio',
  color: 'guides/colors',
  easing: 'tokens/easing',
  'font-size': 'tokens/typography',
  'font-stacks': 'tokens/typography',
  'font-weight': 'tokens/typography',
  'letter-spacing': 'tokens/typography',
  'line-height': 'tokens/typography',
  radii: 'tokens/radii',
  shadow: 'tokens/shadows',
  size: 'tokens/size',
  space: 'tokens/space',
  theme: 'guides/theming',
  zindex: 'tokens/z-index',
}

function classDocsUrl(
  source: string,
  componentPages: Set<string>,
): string | undefined {
  if (source.startsWith('utility/')) {
    const page = UTILITY_DOCS_PAGES[source.slice('utility/'.length)]
    return page ? `${DOCS_BASE_URL}/utilities/${page}` : undefined
  }
  if (componentPages.has(source)) {
    return `${DOCS_BASE_URL}/components/${source}`
  }
  return undefined
}

function buildClasses(
  manifest: Manifest,
  componentPages: Set<string>,
): ClassEntry[] {
  // A class can be picked up from several CSS files (e.g. field.css also
  // references .zui-input). Keep one entry per name, preferring the source
  // the class is named after.
  const byName = new Map<string, ClassEntry>()
  for (const entry of manifest.classes) {
    const existing = byName.get(entry.name)
    if (existing && !entry.name.startsWith(`zui-${entry.source}`)) continue
    if (!existing?.name.startsWith(`zui-${existing.source}`)) {
      byName.set(entry.name, entry)
    }
  }
  return [...byName.values()].map((entry) => {
    const docsUrl = classDocsUrl(entry.source, componentPages)
    return docsUrl ? { ...entry, docsUrl } : entry
  })
}

function buildTokens(manifest: Manifest): TokenEntry[] {
  return manifest.tokens.map((entry) => {
    const page = TOKEN_DOCS_PAGES[entry.category]
    return page ? { ...entry, docsUrl: `${DOCS_BASE_URL}/${page}` } : entry
  })
}

// ─── Snippets (from <Demo> blocks in the docs MDX) ───────────────────────────

const FRAMEWORK_PROPS = new Set<Framework>([
  'html',
  'react',
  'astro',
  'solid',
  'svelte',
  'vue',
])

interface ParsedDemo {
  index: number
  frameworks: Partial<Record<Framework, string>>
}

/**
 * Extract every `<Demo …>` opening tag from an MDX source and pull out its
 * framework props. Props are template-literal strings (`react={`…`}`), so a
 * prop value runs until the next backtick-brace pair.
 */
function parseDemos(source: string): ParsedDemo[] {
  const demos: ParsedDemo[] = []
  let cursor = 0
  while (true) {
    const start = source.indexOf('<Demo', cursor)
    if (start === -1) break
    // Reject other components like <DemoGrid>
    const after = source[start + '<Demo'.length]
    if (after !== undefined && /[\w-]/.test(after)) {
      cursor = start + '<Demo'.length
      continue
    }
    const frameworks: Partial<Record<Framework, string>> = {}
    let i = start + '<Demo'.length
    while (i < source.length) {
      if (source[i] === '>' || source.startsWith('/>', i)) break
      const prop = /^([\w-]+)=\{`/.exec(source.slice(i, i + 40))
      if (prop) {
        const valueStart = i + prop[0].length
        const valueEnd = source.indexOf('`}', valueStart)
        if (valueEnd === -1) break
        const name = prop[1] as Framework
        if (FRAMEWORK_PROPS.has(name)) {
          frameworks[name] = source.slice(valueStart, valueEnd).trim()
        }
        i = valueEnd + 2
      } else {
        i++
      }
    }
    if (Object.keys(frameworks).length > 0) {
      demos.push({ frameworks, index: start })
    }
    cursor = i
  }
  return demos
}

function headingsWithIndices(
  source: string,
): { index: number; text: string }[] {
  const headings: { index: number; text: string }[] = []
  const re = /^#{2,3}\s+(.+)$/gm
  for (const match of source.matchAll(re)) {
    headings.push({ index: match.index, text: match[1].trim() })
  }
  return headings
}

function buildSnippets(files: MdxSource[]): SnippetEntry[] {
  const snippets: SnippetEntry[] = []
  for (const file of files) {
    if (!file.source.includes('<Demo')) continue
    const frontmatter = parseFrontmatter(file.source)
    const path = urlPathFor(file.path)
    const page =
      frontmatter.title ?? path.split('/').filter(Boolean).pop() ?? 'Untitled'
    const headings = headingsWithIndices(file.source)
    const slug = path.split('/').filter(Boolean).join('-')
    parseDemos(file.source).forEach((demo, demoIndex) => {
      const heading = headings.filter((h) => h.index < demo.index).at(-1)
      snippets.push({
        frameworks: demo.frameworks,
        id: `${slug}-${demoIndex}`,
        page,
        pageUrl: `${DOCS_BASE_URL}${path}`,
        title: heading?.text ?? 'Usage',
      })
    })
  }
  return snippets
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export function buildReferenceData(
  mdxSources: MdxSource[],
  manifest: Manifest,
  generatedAt: string,
): ReferenceData {
  const files = [...mdxSources].sort((a, b) => a.path.localeCompare(b.path))
  const componentPages = new Set(
    files
      .map((f) => /^components\/(.+)\.mdx$/.exec(f.path)?.[1])
      .filter((name): name is string => Boolean(name)),
  )
  return {
    classes: buildClasses(manifest, componentPages),
    docs: buildDocs(files),
    generatedAt,
    schemaVersion: 1,
    snippets: buildSnippets(files),
    tokens: buildTokens(manifest),
    zuiVersion: manifest.version,
  }
}
