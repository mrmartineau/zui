import { describe, expect, it } from 'vitest'
import { attachMenuDom } from './dom'

function createRoot() {
  const root = document.createElement('div')
  root.innerHTML = `
    <button data-zui-menu-trigger>Actions</button>
    <div data-zui-menu-content>
      <button data-zui-menu-item>Profile</button>
      <button data-zui-menu-item disabled>Settings</button>
      <a data-zui-menu-item href="#">Logout</a>
    </div>
  `
  document.body.appendChild(root)
  return root
}

describe('menu dom adapter', () => {
  it('does not loop when internal sync mutates observed attributes', async () => {
    const root = createRoot()
    const instance = attachMenuDom(root)
    const trigger = root.querySelector<HTMLElement>('[data-zui-menu-trigger]')

    trigger?.click()
    await Promise.resolve()

    expect(root.dataset.state).toBe('open')
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')

    instance.destroy()
    root.remove()
  })

  it('applies aria and data attributes', () => {
    const root = createRoot()
    const instance = attachMenuDom(root, { defaultOpen: true })

    const trigger = root.querySelector<HTMLElement>('[data-zui-menu-trigger]')
    const content = root.querySelector<HTMLElement>('[data-zui-menu-content]')
    const items = root.querySelectorAll<HTMLElement>('[data-zui-menu-item]')

    expect(root.classList.contains('zui-menu')).toBe(true)
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu')
    expect(content?.getAttribute('role')).toBe('menu')
    expect(content?.hidden).toBe(false)
    expect(items[0]?.getAttribute('role')).toBe('menuitem')

    instance.destroy()
    root.remove()
  })

  it('closes on outside pointerdown', () => {
    const root = createRoot()
    const instance = attachMenuDom(root, { defaultOpen: true })

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))

    expect(root.dataset.state).toBe('closed')

    instance.destroy()
    root.remove()
  })

  it('resyncs root option attribute changes', async () => {
    const root = createRoot()
    const instance = attachMenuDom(root)

    root.dataset.disabled = 'true'
    root.dataset.open = 'true'

    await Promise.resolve()
    instance.sync()

    const trigger = root.querySelector<HTMLButtonElement>('[data-zui-menu-trigger]')
    const content = root.querySelector<HTMLElement>('[data-zui-menu-content]')

    expect(root.dataset.state).toBe('open')
    expect(trigger?.disabled).toBe(true)
    expect(content?.hidden).toBe(false)

    instance.destroy()
    root.remove()
  })

  it('resyncs dynamically inserted items', async () => {
    const root = createRoot()
    const instance = attachMenuDom(root, { defaultOpen: true })
    const content = root.querySelector('[data-zui-menu-content]')
    const item = document.createElement('button')
    item.setAttribute('data-zui-menu-item', '')
    item.textContent = 'Billing'
    content?.appendChild(item)

    await Promise.resolve()
    instance.sync()

    expect(item.id).toContain('item')
    expect(item.getAttribute('role')).toBe('menuitem')

    instance.destroy()
    root.remove()
  })
})
