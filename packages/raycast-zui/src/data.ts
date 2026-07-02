import classesJson from './data/classes.json'
import docsJson from './data/docs.json'
import snippetsJson from './data/snippets.json'
import tokensJson from './data/tokens.json'
import type { ClassEntry, DocEntry, SnippetEntry, TokenEntry } from './types'

export type { ClassEntry, DocEntry, Framework, SnippetEntry, TokenEntry } from './types'

export const docs = docsJson as DocEntry[]
export const classes = classesJson as ClassEntry[]
export const tokens = tokensJson as TokenEntry[]
export const snippets = snippetsJson as SnippetEntry[]
