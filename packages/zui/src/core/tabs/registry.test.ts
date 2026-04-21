import { describe, expect, it } from 'vitest'
import { TabsRegistry } from './registry'

describe('tabs registry', () => {
  it('treats empty-string values as valid registered keys', () => {
    const registry = new TabsRegistry()

    registry.registerTrigger({
      disabled: false,
      element: null,
      order: 0,
      panelId: 'empty-panel',
      triggerId: 'empty-trigger',
      value: '',
    })

    registry.registerContent({
      element: null,
      panelId: 'empty-panel',
      triggerId: 'empty-trigger',
      value: '',
    })

    expect(registry.hasTrigger('')).toBe(true)
    expect(registry.hasContent('')).toBe(true)
  })
})
