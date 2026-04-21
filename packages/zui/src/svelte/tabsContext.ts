import { getContext, setContext } from 'svelte'
import type { TabsControllerApi, TabsSnapshot } from '../core/tabs'

const TABS_CONTEXT_KEY = 'zui.tabs'

export interface TabsContextValue {
  controller: TabsControllerApi
  getRoot: () => HTMLDivElement | undefined
  getSnapshot: () => TabsSnapshot
}

export function setTabsContext(value: TabsContextValue) {
  setContext(TABS_CONTEXT_KEY, value)
}

export function getTabsContext() {
  const context = getContext<TabsContextValue>(TABS_CONTEXT_KEY)

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
