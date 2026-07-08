import { Action, Cache, Icon, Keyboard, showToast, Toast } from '@raycast/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import bundledJson from './data/reference.json'
import type { ReferenceData } from './types'

export type {
  ClassEntry,
  DocEntry,
  Framework,
  ReferenceData,
  SnippetEntry,
  TokenEntry,
} from './types'

export const REFERENCE_URL = 'https://zui.zander.wtf/api/reference.json'

const CACHE_KEY = 'reference-data'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // one day

const bundled = bundledJson as ReferenceData

const cache = new Cache()

interface CachedReference {
  fetchedAt: number
  data: ReferenceData
}

function isReferenceData(value: unknown): value is ReferenceData {
  if (typeof value !== 'object' || value === null) return false
  const data = value as Partial<ReferenceData>
  return (
    data.schemaVersion === 1 &&
    typeof data.zuiVersion === 'string' &&
    typeof data.generatedAt === 'string' &&
    Array.isArray(data.docs) &&
    Array.isArray(data.classes) &&
    Array.isArray(data.tokens) &&
    Array.isArray(data.snippets)
  )
}

function readCache(): CachedReference | undefined {
  const raw = cache.get(CACHE_KEY)
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw) as CachedReference
    if (typeof parsed.fetchedAt === 'number' && isReferenceData(parsed.data)) {
      return parsed
    }
  } catch {
    // Corrupt cache — fall through and treat as absent.
  }
  cache.remove(CACHE_KEY)
  return undefined
}

/**
 * Best data available without hitting the network: the cached remote payload
 * if it's newer than the bundled snapshot, otherwise the snapshot.
 */
export function getReferenceData(): ReferenceData {
  const cached = readCache()
  if (cached && cached.data.generatedAt >= bundled.generatedAt) {
    return cached.data
  }
  return bundled
}

function isStale(): boolean {
  const cached = readCache()
  return !cached || Date.now() - cached.fetchedAt > MAX_AGE_MS
}

/** Fetch the live dataset and cache it. Throws on network/shape errors. */
export async function fetchReferenceData(): Promise<{
  data: ReferenceData
  updated: boolean
}> {
  const previous = getReferenceData()
  const response = await fetch(REFERENCE_URL)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${REFERENCE_URL}`)
  }
  const payload: unknown = await response.json()
  if (!isReferenceData(payload)) {
    throw new Error('Unexpected response shape from the ZUI docs site')
  }
  cache.set(CACHE_KEY, JSON.stringify({ data: payload, fetchedAt: Date.now() }))
  return {
    data: payload,
    updated: payload.generatedAt !== previous.generatedAt,
  }
}

/**
 * Reference data for list commands. Serves cached/bundled data immediately,
 * silently refreshes in the background when the cache is older than a day,
 * and exposes `refresh` for the manual “Refresh ZUI Data” action.
 */
export function useReferenceData() {
  const [data, setData] = useState<ReferenceData>(getReferenceData)
  const [isLoading, setIsLoading] = useState(isStale)
  const refreshing = useRef(false)

  const refresh = useCallback(async (options?: { silent?: boolean }) => {
    if (refreshing.current) return
    refreshing.current = true
    setIsLoading(true)
    const toast = options?.silent
      ? undefined
      : await showToast({
          style: Toast.Style.Animated,
          title: 'Updating ZUI data…',
        })
    try {
      const { data: fresh, updated } = await fetchReferenceData()
      setData(fresh)
      if (toast) {
        toast.style = Toast.Style.Success
        toast.title = updated
          ? `Updated to ZUI v${fresh.zuiVersion}`
          : 'Already up to date'
        toast.message = updated
          ? `Data generated ${new Date(fresh.generatedAt).toLocaleString()}`
          : `ZUI v${fresh.zuiVersion}`
      }
    } catch (error) {
      if (toast) {
        toast.style = Toast.Style.Failure
        toast.title = 'Could not update ZUI data'
        toast.message = error instanceof Error ? error.message : String(error)
      }
    } finally {
      refreshing.current = false
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isStale()) {
      void refresh({ silent: true })
    } else {
      setIsLoading(false)
    }
  }, [refresh])

  return { data, isLoading, refresh }
}

export function RefreshDataAction({
  refresh,
}: {
  refresh: (options?: { silent?: boolean }) => void
}) {
  return (
    <Action
      icon={Icon.ArrowClockwise}
      title="Refresh ZUI Data"
      shortcut={Keyboard.Shortcut.Common.Refresh}
      onAction={() => refresh()}
    />
  )
}
