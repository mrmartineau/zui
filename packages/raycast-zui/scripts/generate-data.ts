#!/usr/bin/env tsx
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  ClassEntry,
  DocEntry,
  Framework,
  SnippetEntry,
  TokenEntry,
} from '../src/types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const repoRoot = join(__dirname, '../../..')
const docsPagesDir = join(repoRoot, 'docs/src/pages')
const manifestPath = join(repoRoot, 'packages/vscode-zui/src/manifest.json')
const outDir = join(__dirname, '../src/data')

const DOCS_BASE_URL = 'https://zui.zander.wtf'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Manifest {
  version: string
  classes: { name: string; source: string }[]
  tokens: { name: string; value: string; category: string; color?: string }[]
}

// ─── Docs pages ──────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<string, string> = {
  components: 'Components',
  guides: 'Guides',
  integrations: 'Integrations',
  tokens: 'Tokens',
  utilities: 'Utilities',
}

function walkMdxFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...walkMdxFiles(full))
    } else if (entry.endsWith('.mdx')) {
      files.push(full)
    }
  }
  return files.sort()
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

function urlPathFor(file: string): string {
  const rel = relative(docsPagesDir, file)
    .split(sep)
    .join('/')
    .replace(/\.mdx$/, '')
  const path =
    rel.endsWith('/index') || rel === 'index'
      ? rel.replace(/\/?index$/, '')
      : rel
  return `/${path}`.replace(/\/$/, '') || '/'
}

function buildDocs(files: string[]): DocEntry[] {
  const docs: DocEntry[] = []
  for (const file of files) {
    const frontmatter = parseFrontmatter(readFileSync(file, 'utf-8'))
    if (!frontmatter.title) continue
    const path = urlPathFor(file)
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

function classDocsUrl(source: string): string | undefined {
  if (source.startsWith('utility/')) {
    const page = UTILITY_DOCS_PAGES[source.slice('utility/'.length)]
    return page ? `${DOCS_BASE_URL}/utilities/${page}` : undefined
  }
  if (existsSync(join(docsPagesDir, 'components', `${source}.mdx`))) {
    return `${DOCS_BASE_URL}/components/${source}`
  }
  return undefined
}

function buildClasses(manifest: Manifest): ClassEntry[] {
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
    const docsUrl = classDocsUrl(entry.source)
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

function buildSnippets(files: string[]): SnippetEntry[] {
  const snippets: SnippetEntry[] = []
  for (const file of files) {
    const source = readFileSync(file, 'utf-8')
    if (!source.includes('<Demo')) continue
    const frontmatter = parseFrontmatter(source)
    const path = urlPathFor(file)
    const page =
      frontmatter.title ?? path.split('/').filter(Boolean).pop() ?? 'Untitled'
    const headings = headingsWithIndices(source)
    const slug = path.split('/').filter(Boolean).join('-')
    parseDemos(source).forEach((demo, demoIndex) => {
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

// ─── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(manifestPath)) {
  console.error(
    `✗ Missing ${manifestPath}\n  Run \`pnpm --filter vscode-zui run build:manifest\` first.`,
  )
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest
const mdxFiles = walkMdxFiles(docsPagesDir)

const docs = buildDocs(mdxFiles)
const classes = buildClasses(manifest)
const tokens = buildTokens(manifest)
const snippets = buildSnippets(mdxFiles)

mkdirSync(outDir, { recursive: true })
const write = (file: string, data: unknown) =>
  writeFileSync(join(outDir, file), `${JSON.stringify(data, null, 2)}\n`)

write('docs.json', docs)
write('classes.json', classes)
write('tokens.json', tokens)
write('snippets.json', snippets)

const snippetCount = snippets.reduce(
  (n, s) => n + Object.keys(s.frameworks).length,
  0,
)
console.log(
  `✓ data (zui v${manifest.version}): ${docs.length} docs pages, ${classes.length} classes, ${tokens.length} tokens, ${snippets.length} demos (${snippetCount} snippets) → ${outDir}`,
)
