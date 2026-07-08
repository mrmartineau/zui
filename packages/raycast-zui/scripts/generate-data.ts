#!/usr/bin/env tsx
/**
 * Snapshots the ZUI reference dataset into `src/data/reference.json`, used as
 * the bundled fallback when the extension has no network / cached data.
 *
 * The live dataset is served by the docs site at
 * `https://zui.zander.wtf/api/reference.json` — both are produced by the
 * shared builder in `docs/src/lib/reference-data.ts`.
 */
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
import {
  buildReferenceData,
  type Manifest,
  type MdxSource,
} from '../../../docs/src/lib/reference-data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const repoRoot = join(__dirname, '../../..')
const docsPagesDir = join(repoRoot, 'docs/src/pages')
const manifestPath = join(repoRoot, 'packages/vscode-zui/src/manifest.json')
const outDir = join(__dirname, '../src/data')

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

if (!existsSync(manifestPath)) {
  console.error(
    `✗ Missing ${manifestPath}\n  Run \`pnpm --filter vscode-zui run build:manifest\` first.`,
  )
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Manifest

const mdxSources: MdxSource[] = walkMdxFiles(docsPagesDir).map((file) => ({
  path: relative(docsPagesDir, file).split(sep).join('/'),
  source: readFileSync(file, 'utf-8'),
}))

const data = buildReferenceData(mdxSources, manifest, new Date().toISOString())

mkdirSync(outDir, { recursive: true })
writeFileSync(
  join(outDir, 'reference.json'),
  `${JSON.stringify(data, null, 2)}\n`,
)

const snippetCount = data.snippets.reduce(
  (n, s) => n + Object.keys(s.frameworks).length,
  0,
)
console.log(
  `✓ data (zui v${data.zuiVersion}): ${data.docs.length} docs pages, ${data.classes.length} classes, ${data.tokens.length} tokens, ${data.snippets.length} demos (${snippetCount} snippets) → ${outDir}`,
)
