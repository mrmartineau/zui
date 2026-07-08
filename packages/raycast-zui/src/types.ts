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

/**
 * Payload served by https://zui.zander.wtf/api/reference.json and snapshotted
 * into `data/reference.json`. Keep in sync with
 * `docs/src/lib/reference-data.ts`.
 */
export interface ReferenceData {
  schemaVersion: 1
  zuiVersion: string
  generatedAt: string
  docs: DocEntry[]
  classes: ClassEntry[]
  tokens: TokenEntry[]
  snippets: SnippetEntry[]
}
