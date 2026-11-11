/** Shared by the search overlay (React) and the /search page (Astro). */

export interface SearchResult {
  title: string
  /** Absolute from /api/search, relative from searchIndex(). Use `toPath`. */
  url: string
  type: string
  snippet: string | null
}

export const typeLabels: Record<string, string> = {
  component: 'Component',
  guide: 'Guide',
  integration: 'Integration',
  token: 'Token',
  utility: 'Utility',
}

/** Same-origin path, so links work in dev and prod and keep view transitions. */
export const toPath = (url: string) => {
  const { pathname, search, hash } = new URL(url, 'http://x')
  return pathname + search + hash
}

/**
 * Component names win. A component whose title is the query ranks first, then
 * components whose title contains every query word. Everything else keeps its
 * bm25 order (Array.sort is stable).
 */
export function rankResults<T extends Pick<SearchResult, 'title' | 'type'>>(
  results: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  const tier = ({ title, type }: T) => {
    if (type !== 'component') return 2
    const name = title.toLowerCase()
    if (name === q) return 0
    return words.every((word) => name.includes(word)) ? 1 : 2
  }
  return [...results].sort((a, b) => tier(a) - tier(b))
}

/**
 * Split an FTS5 snippet on its <mark> tags. Odd entries are the matches.
 * Render the parts as text so stray "<" in the content cannot break the markup.
 */
export const splitSnippet = (snippet: string | null) =>
  (snippet ?? '')
    .split(/<\/?mark>/)
    .map((text, i) => ({ hit: i % 2 === 1, text }))
    .filter((part) => part.text)
