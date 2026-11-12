import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { runCli } from 'astro-d1-search/indexer'
import searchConfig from '../search.config'

// <Demo html={`...`} react={`...`}> carries whole code samples in its props. The indexer
// ends a tag at the first ">", so those samples would leak into the result snippets.
// This matches a component tag and skips any ">" inside a backtick string.
const COMPONENT_TAG = /<\/?[A-Z][\w.]*(?:[^>`]|`[^`]*`)*>/g

// Index a cleaned copy of each section. It leaves out index.mdx: every one is titled
// "Overview" and would link to /<section>/index (a 404).
const copy = mkdtempSync(join(tmpdir(), 'zui-search-'))

try {
  await runCli({
    ...searchConfig,
    sources: searchConfig.sources.map(({ dir, ...source }) => {
      const target = join(copy, basename(dir as string))
      mkdirSync(target)
      for (const file of readdirSync(dir as string)) {
        if (!file.endsWith('.mdx') || file === 'index.mdx') continue
        const text = readFileSync(join(dir as string, file), 'utf8')
        writeFileSync(join(target, file), text.replace(COMPONENT_TAG, ''))
      }
      return { ...source, dir: target }
    }),
  })
} finally {
  rmSync(copy, { force: true, recursive: true })
}
