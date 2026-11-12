/** @jsxImportSource react */

import { navigate } from 'astro:transitions/client'
import { Tooltip } from '@mrmartineau/zui/react'
import { Command } from 'cmdk'
import { useEffect, useRef, useState } from 'react'
import {
  MAX_QUERY_LENGTH,
  rankResults,
  type SearchResult,
  toPath,
  typeLabels,
} from '../lib/search'
import '../styles/cmdk-zui.css'
import '../styles/search.css'

// /api/search returns [] for anything shorter.
const MIN_LENGTH = 2
// Ask for the most the endpoint gives (its maxLimit), rank, then keep SHOW rows. Ranking
// before cutting stops a component whose name matches from being cut for a worse bm25 hit.
const FETCH_LIMIT = 25
const SHOW = 10
const SEE_ALL = 'see-all-results'

type Status = 'idle' | 'loading' | 'done' | 'error'

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

/** Search button for the header. Opens a cmdk overlay on click or on "/". */
export default function Search() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState('')
  // Front matter descriptions by page path, loaded the first time the overlay opens.
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const descriptionsLoaded = useRef(false)
  const list = useRef<HTMLDivElement>(null)
  const text = query.trim().slice(0, MAX_QUERY_LENGTH)
  // Rows of an earlier query stay on screen while the next one loads, so the list does not
  // flicker. They must not be selectable: Enter would open a page the user did not ask for.
  const stale = status !== 'done'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(e.metaKey || e.ctrlKey || e.altKey) &&
        !isTyping(e.target)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open || descriptionsLoaded.current) return
    descriptionsLoaded.current = true
    fetch('/search-descriptions.json')
      .then((res) => res.json())
      .then(setDescriptions, () => {
        descriptionsLoaded.current = false // try again next time it opens
      })
  }, [open])

  // Live search: wait 150ms after the last keystroke, drop answers to stale queries.
  useEffect(() => {
    if (text.length < MIN_LENGTH) {
      setResults([])
      setStatus('idle')
      return
    }
    setStatus('loading')
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?limit=${FETCH_LIMIT}&q=${encodeURIComponent(text)}`,
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        const data = (await res.json()) as { results: SearchResult[] }
        const ranked = rankResults(data.results, text).slice(0, SHOW)
        setResults(ranked)
        // Hovering a low row scrolls the list. Start every new result set from the top.
        list.current?.scrollTo({ top: 0 })
        // cmdk picks its first row before these results arrive: pick the top hit ourselves.
        setActive(ranked[0]?.url ?? SEE_ALL)
        setStatus('done')
      } catch {
        if (controller.signal.aborted) return
        setResults([]) // never leave rows of an earlier query next to an error
        setStatus('error')
      }
    }, 150)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [text])

  const go = (href: string) => {
    setOpen(false)
    navigate(href)
  }

  const message =
    status === 'error'
      ? 'Search is not available right now.'
      : status === 'idle'
        ? 'Type to search components, tokens and guides.'
        : status === 'done' && results.length === 0
          ? `No results for “${text}”.`
          : status === 'loading' && results.length === 0
            ? 'Searching…'
            : null

  return (
    <>
      <Tooltip text="Search (/)" placement="bottom">
        <button
          type="button"
          className="zui-button zui-button-variant-ghost zui-button-shape-squircle"
          aria-label="Search"
          aria-keyshortcuts="/"
          onClick={() => setOpen(true)}
        >
          <i className="ph ph-magnifying-glass" />
        </button>
      </Tooltip>

      <Command.Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQuery('')
        }}
        label="Search the docs"
        shouldFilter={false}
        value={active}
        onValueChange={setActive}
      >
        <Command.Input
          value={query}
          onValueChange={setQuery}
          maxLength={MAX_QUERY_LENGTH}
          placeholder="Search the docs…"
        />
        <Command.List ref={list} aria-busy={stale}>
          {message && (
            <div className="search-status" role="status">
              {message}
            </div>
          )}
          {results.map((result) => (
            <Command.Item
              key={result.url}
              value={result.url}
              data-stale={stale || undefined}
              onSelect={() => {
                if (!stale) go(toPath(result.url))
              }}
            >
              <span className="search-result">
                <span className="search-result-title">{result.title}</span>
                <span className="search-result-description">
                  {descriptions[toPath(result.url)]}
                </span>
              </span>
              <span className="zui-badge zui-badge-variant-outline">
                {typeLabels[result.type] ?? result.type}
              </span>
            </Command.Item>
          ))}
          {text.length >= MIN_LENGTH && (
            <Command.Item
              value={SEE_ALL}
              onSelect={() => go(`/search?q=${encodeURIComponent(text)}`)}
            >
              <i className="ph ph-arrow-right" />
              See all results for “{text}”
            </Command.Item>
          )}
        </Command.List>
      </Command.Dialog>
    </>
  )
}
