import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { MenuControllerApi, MenuSnapshot } from '../core/menu'

export interface MenuContextValue {
  controller: MenuControllerApi
  rootRef: Ref<HTMLDivElement | undefined>
  snapshot: Ref<MenuSnapshot>
}

export const menuContextKey: InjectionKey<MenuContextValue> = Symbol('zui.menu')

export function provideMenuContext(value: MenuContextValue) {
  provide(menuContextKey, value)
}

export function useMenuContext() {
  const context = inject(menuContextKey)

  if (!context) {
    throw new Error('Menu components must be used within <Menu>.')
  }

  return context
}

export function getMenuItemOrder(
  root: HTMLDivElement | undefined,
  element: HTMLElement | undefined,
) {
  if (!root || !element) return 0

  return [...root.querySelectorAll<HTMLElement>('[data-zui-menu-item]')].indexOf(
    element,
  )
}
