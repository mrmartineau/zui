import type { APIRoute } from 'astro'

export const prerender = true

// Front matter `description` of every docs page, read at build time:
// { "/components/button": "A button…" }. The search overlay fetches this to
// show a subheading under each hit, because /api/search does not return one.
const frontmatter = import.meta.glob<{ description?: string }>('./*/*.mdx', {
  eager: true,
  import: 'frontmatter',
})

const descriptions = Object.fromEntries(
  Object.entries(frontmatter)
    .filter(([file, data]) => !file.endsWith('/index.mdx') && data.description)
    .map(([file, data]) => [file.slice(1, -'.mdx'.length), data.description]),
)

export const GET: APIRoute = () => Response.json(descriptions)
