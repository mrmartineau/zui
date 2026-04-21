import { describe, expect, it, vi } from 'vitest'
import { createTabsController } from './controller'

function registerTrigger(
  controller: ReturnType<typeof createTabsController>,
  value: string,
  order: number,
  disabled = false,
) {
  return controller.registerTrigger({
    disabled,
    element: null,
    order,
    panelId: `${value}-panel`,
    triggerId: `${value}-trigger`,
    value,
  })
}

describe('tabs controller', () => {
  it('uses defaultValue when valid', () => {
    const controller = createTabsController({ defaultValue: 'security' })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1)

    expect(controller.getSnapshot().selectedValue).toBe('security')
  })

  it('falls back to first enabled trigger when defaultValue is invalid', () => {
    const controller = createTabsController({ defaultValue: 'missing' })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1, true)

    expect(controller.getSnapshot().selectedValue).toBe('account')
  })

  it('respects controlled value', () => {
    const controller = createTabsController({ value: 'billing' })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'billing', 1)

    expect(controller.getSnapshot().selectedValue).toBe('billing')
    controller.clickTrigger('account')
    expect(controller.getSnapshot().selectedValue).toBe('billing')
  })

  it('fires onValueChange once for uncontrolled click changes', () => {
    const onValueChange = vi.fn()
    const controller = createTabsController({ defaultValue: 'account', onValueChange })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1)

    controller.clickTrigger('security')

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('security')
    expect(controller.getSnapshot().selectedValue).toBe('security')
  })

  it('skips disabled triggers during keyboard navigation', () => {
    const controller = createTabsController({ defaultValue: 'account' })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1, true)
    registerTrigger(controller, 'billing', 2)

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    controller.handleTriggerKeydown(event, 'account')

    expect(controller.getSnapshot().selectedValue).toBe('billing')
    expect(controller.getSnapshot().focusedValue).toBe('billing')
  })

  it('supports manual activation mode', () => {
    const controller = createTabsController({ defaultValue: 'account', activationMode: 'manual' })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1)

    controller.handleTriggerKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }), 'account')
    expect(controller.getSnapshot().focusedValue).toBe('security')
    expect(controller.getSnapshot().selectedValue).toBe('account')

    controller.handleTriggerKeydown(new KeyboardEvent('keydown', { key: 'Enter' }), 'security')
    expect(controller.getSnapshot().selectedValue).toBe('security')
  })

  it('does not move focus or emit when clicking a disabled trigger', () => {
    const onValueChange = vi.fn()
    const controller = createTabsController({ defaultValue: 'account', onValueChange })
    registerTrigger(controller, 'account', 0)
    registerTrigger(controller, 'security', 1, true)

    controller.clickTrigger('security')

    expect(controller.getSnapshot().selectedValue).toBe('account')
    expect(controller.getSnapshot().focusedValue).toBe('account')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('ignores root id changes in setOptions', () => {
    const controller = createTabsController({ id: 'tabs-a' })

    controller.setOptions({ id: 'tabs-b' })

    expect(controller.getSnapshot().rootId).toBe('tabs-a')
  })
})
