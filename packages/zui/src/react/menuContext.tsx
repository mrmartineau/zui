import { createContext, useContext, useSyncExternalStore, type RefObject } from 'react'
import type { MenuControllerApi, MenuSnapshot } from '../core/menu'

export interface MenuContextValue {
  controller: MenuControllerApi
  rootRef: RefObject<HTMLDivElement | null>
}

export const MenuContext = createContext<MenuContextValue | null>(null)

export function useMenuContext() {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error('Menu components must be used within <Menu>.')
  }

  return context
}

export function useMenuSnapshot(): MenuSnapshot {
  const { controller } = useMenuContext()
  return useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )
}

export function getMenuItemOrder(
  root: HTMLDivElement | null,
  element: HTMLElement | null,
) {
  if (!root || !element) return 0

  return [...root.querySelectorAll<HTMLElement>('[data-zui-menu-item]')].indexOf(
    element,
  )
}
