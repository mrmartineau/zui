import { describe, expect, it } from 'vitest'
import { attachTabsDom } from './dom'

function createRoot() {
  const root = document.createElement('div')
  root.innerHTML = `
    <div data-zui-tabs-list aria-label="Demo tabs">
      <button data-zui-tabs-trigger data-value="account">Account</button>
      <button data-zui-tabs-trigger data-value="security">Security</button>
    </div>
    <div data-zui-tabs-content data-value="account">Account panel</div>
    <div data-zui-tabs-content data-value="security">Security panel</div>
  `
  document.body.appendChild(root)
  return root
}

describe('tabs dom adapter', () => {
  it('applies aria attributes and selected state', () => {
    const root = createRoot()
    const instance = attachTabsDom(root, { defaultValue: 'security' })

    const triggers = root.querySelectorAll<HTMLElement>('[data-zui-tabs-trigger]')
    const panels = root.querySelectorAll<HTMLElement>('[data-zui-tabs-content]')

    expect(root.classList.contains('zui-tabs')).toBe(true)
    expect(triggers[1]?.getAttribute('aria-selected')).toBe('true')
    expect(triggers[1]?.tabIndex).toBe(0)
    expect(triggers[0]?.tabIndex).toBe(-1)
    expect(panels[1]?.hidden).toBe(false)
    expect(panels[0]?.hidden).toBe(true)

    instance.destroy()
    root.remove()
  })

  it('resyncs when new triggers and panels are added', async () => {
    const root = createRoot()
    const instance = attachTabsDom(root, { defaultValue: 'account' })

    const list = root.querySelector('[data-zui-tabs-list]')
    const trigger = document.createElement('button')
    trigger.setAttribute('data-zui-tabs-trigger', '')
    trigger.setAttribute('data-value', 'billing')
    trigger.textContent = 'Billing'
    list?.appendChild(trigger)

    const panel = document.createElement('div')
    panel.setAttribute('data-zui-tabs-content', '')
    panel.setAttribute('data-value', 'billing')
    panel.textContent = 'Billing panel'
    root.appendChild(panel)

    await Promise.resolve()
    instance.sync()

    const addedTrigger = root.querySelector<HTMLElement>('[data-zui-tabs-trigger][data-value="billing"]')
    const addedPanel = root.querySelector<HTMLElement>('[data-zui-tabs-content][data-value="billing"]')

    expect(addedTrigger?.id).toContain('billing')
    expect(addedPanel?.getAttribute('aria-labelledby')).toBe(addedTrigger?.id)

    instance.destroy()
    root.remove()
  })
})
