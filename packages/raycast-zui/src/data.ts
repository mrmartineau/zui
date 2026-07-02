import classesJson from './data/classes.json'
import docsJson from './data/docs.json'
import snippetsJson from './data/snippets.json'
import tokensJson from './data/tokens.json'

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

export const docs = docsJson as DocEntry[]
export const classes = classesJson as ClassEntry[]
export const tokens = tokensJson as TokenEntry[]
export const snippets = snippetsJson as SnippetEntry[]
