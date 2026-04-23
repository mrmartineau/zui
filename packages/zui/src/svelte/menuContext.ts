import { getContext, setContext } from 'svelte'
import type { MenuControllerApi, MenuSnapshot } from '../core/menu'

const MENU_CONTEXT_KEY = 'zui.menu'

export interface MenuContextValue {
  controller: MenuControllerApi
  getRoot: () => HTMLDivElement | undefined
  getSnapshot: () => MenuSnapshot
}

export function setMenuContext(value: MenuContextValue) {
  setContext(MENU_CONTEXT_KEY, value)
}

export function getMenuContext() {
  const context = getContext<MenuContextValue>(MENU_CONTEXT_KEY)

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
