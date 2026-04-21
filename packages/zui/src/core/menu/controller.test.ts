import { describe, expect, it, vi } from 'vitest'
import { createMenuController } from './controller'

function registerTrigger(controller: ReturnType<typeof createMenuController>, disabled = false) {
  return controller.registerTrigger({
    disabled,
    element: document.createElement('button'),
    triggerId: 'menu-trigger',
  })
}

function registerItems(controller: ReturnType<typeof createMenuController>) {
  const createItem = (id: string, order: number, disabled = false, textValue?: string) => {
    const element = document.createElement('button')
    element.textContent = textValue ?? id
    return controller.registerItem({
      disabled,
      element,
      id,
      kind: 'button',
      order,
      textValue,
    })
  }

  return [
    createItem('profile', 0, false, 'Profile'),
    createItem('settings', 1, true, 'Settings'),
    createItem('logout', 2, false, 'Logout'),
  ]
}

describe('menu controller', () => {
  it('opens uncontrolled menus and focuses the first enabled item', () => {
    const controller = createMenuController()
    registerTrigger(controller)
    registerItems(controller)

    controller.openMenu({ focus: 'first' })

    expect(controller.getSnapshot().open).toBe(true)
    expect(controller.getSnapshot().highlightedItemId).toBe('profile')
  })

  it('respects controlled open state', () => {
    const onOpenChange = vi.fn()
    const controller = createMenuController({ open: false, onOpenChange })
    registerTrigger(controller)
    registerItems(controller)

    controller.openMenu({ focus: 'first' })

    expect(controller.getSnapshot().open).toBe(false)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('skips disabled items during navigation', () => {
    const controller = createMenuController({ defaultOpen: true })
    registerTrigger(controller)
    registerItems(controller)

    controller.openMenu({ focus: 'first' })
    controller.focusNextItem('profile')

    expect(controller.getSnapshot().highlightedItemId).toBe('logout')
  })

  it('does not emit for rejected transitions from disabled root', () => {
    const onOpenChange = vi.fn()
    const controller = createMenuController({ disabled: true, onOpenChange })
    registerTrigger(controller)
    registerItems(controller)

    controller.openMenu({ focus: 'first' })

    expect(controller.getSnapshot().open).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('supports typeahead', () => {
    const controller = createMenuController({ defaultOpen: true })
    registerTrigger(controller)
    registerItems(controller)

    controller.openMenu({ focus: 'first' })
    controller.handleItemTextInput('l')

    expect(controller.getSnapshot().highlightedItemId).toBe('logout')
  })
})
