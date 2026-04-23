import { createContext, useContext } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { MenuControllerApi, MenuSnapshot } from '../core/menu'

export interface MenuContextValue {
  controller: MenuControllerApi
  rootRef: Accessor<HTMLDivElement | undefined>
  snapshot: Accessor<MenuSnapshot>
}

export const MenuContext = createContext<MenuContextValue>()

export function useMenuContext() {
  const context = useContext(MenuContext)

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
