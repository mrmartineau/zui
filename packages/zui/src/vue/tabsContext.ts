import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { TabsControllerApi, TabsSnapshot } from '../core/tabs'

export interface TabsContextValue {
  controller: TabsControllerApi
  rootRef: Ref<HTMLDivElement | undefined>
  snapshot: Ref<TabsSnapshot>
}

export const tabsContextKey: InjectionKey<TabsContextValue> = Symbol('zui.tabs')

export function provideTabsContext(value: TabsContextValue) {
  provide(tabsContextKey, value)
}

export function useTabsContext() {
  const context = inject(tabsContextKey)

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
