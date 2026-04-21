import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { TabsControllerApi, TabsSnapshot } from '../core/tabs'

export interface TabsContextValue {
  controller: TabsControllerApi
  rootRef: Accessor<HTMLDivElement | undefined>
  snapshot: Accessor<TabsSnapshot>
}

export const TabsContext = createContext<TabsContextValue>()

export function useTabsContext() {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>.')
  }

  return context
}

export function getTabsTriggerOrder(
  root: HTMLDivElement | undefined,
  element: HTMLElement | undefined,
) {
  if (!root || !element) return 0

  return [...root.querySelectorAll<HTMLElement>('[data-zui-tabs-trigger]')].indexOf(
    element,
  )
}
