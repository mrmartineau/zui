import {
  createContext,
  type RefObject,
  useContext,
  useSyncExternalStore,
} from 'react'
import type { TabsControllerApi, TabsSnapshot } from '../core/tabs'

export interface TabsContextValue {
  controller: TabsControllerApi
  rootRef: RefObject<HTMLDivElement | null>
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext() {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>.')
  }

  return context
}

export function useTabsSnapshot() {
  const { controller } = useTabsContext()

  return useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  ) as TabsSnapshot
}

export function getTabsTriggerOrder(
  root: HTMLDivElement | null,
  element: HTMLElement | null,
) {
  if (!root || !element) return 0

  return [...root.querySelectorAll<HTMLElement>('[data-zui-tabs-trigger]')].indexOf(
    element,
  )
}
