import type { APIRoute } from 'astro'
import manifest from '../../../../packages/vscode-zui/src/manifest.json'
import {
  buildReferenceData,
  type Manifest,
  type MdxSource,
} from '../../lib/reference-data'

export const prerender = true

// Raw MDX sources for every docs page, resolved at build time.
const rawPages = import.meta.glob('../**/*.mdx', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const mdxSources: MdxSource[] = Object.entries(rawPages).map(
  ([path, source]) => ({
    path: path.replace(/^\.\.\//, ''),
    source,
  }),
)

export const GET: APIRoute = () => {
  const data = buildReferenceData(
    mdxSources,
    manifest as Manifest,
    new Date().toISOString(),
  )
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
