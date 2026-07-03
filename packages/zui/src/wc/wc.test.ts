import { beforeEach, describe, expect, it } from 'vitest'
import './index'
import type { ZuiDialog, ZuiTabs } from './index'

function mount(html: string): HTMLElement {
  document.body.innerHTML = html
  return document.body.firstElementChild as HTMLElement
}

async function flushObservers(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('class hosts', () => {
  it('applies base and variant classes to the host', () => {
    const badge = mount('<zui-badge color="blue">New</zui-badge>')
    expect(badge.classList.contains('zui-badge')).toBe(true)
    expect(badge.classList.contains('zui-badge-color-blue')).toBe(true)
  })

  it('re-resolves classes when variant attributes change', () => {
    const badge = mount('<zui-badge color="blue">New</zui-badge>')
    badge.setAttribute('color', 'red')
    expect(badge.classList.contains('zui-badge-color-red')).toBe(true)
    expect(badge.classList.contains('zui-badge-color-blue')).toBe(false)
  })

  it('preserves author classes', () => {
    const badge = mount('<zui-badge class="my-badge">New</zui-badge>')
    badge.setAttribute('color', 'red')
    expect(badge.classList.contains('my-badge')).toBe(true)
  })

  it('resolves flex variant attributes with kebab-case names', () => {
    const flex = mount('<zui-flex direction="column" gap-x="sm"></zui-flex>')
    expect(flex.classList.contains('flex')).toBe(true)
    expect(flex.classList.contains('flex-column')).toBe(true)
    expect(flex.classList.contains('gapx-sm')).toBe(true)
  })

  it('applies roles to field parts', () => {
    const field = mount('<zui-field invalid></zui-field>')
    expect(field.getAttribute('role')).toBe('group')
    expect(field.classList.contains('zui-field-invalid')).toBe(true)
  })
})

describe('zui-button', () => {
  it('renders an inner native button with variant classes', () => {
    const host = mount(
      '<zui-button variant="outline" size="lg">Save</zui-button>',
    )
    const button = host.querySelector('button')
    expect(button).toBeTruthy()
    expect(button?.textContent).toBe('Save')
    expect(button?.classList.contains('zui-button')).toBe(true)
    expect(button?.classList.contains('zui-button-variant-outline')).toBe(true)
    expect(button?.classList.contains('zui-button-size-lg')).toBe(true)
  })

  it('renders an anchor when href is set', () => {
    const host = mount('<zui-button href="/docs">Docs</zui-button>')
    const anchor = host.querySelector('a')
    expect(anchor?.getAttribute('href')).toBe('/docs')
    expect(anchor?.classList.contains('zui-button')).toBe(true)
    expect(host.querySelector('button')).toBeNull()
  })

  it('forwards non-variant attributes to the native element', async () => {
    const host = mount('<zui-button disabled>Save</zui-button>')
    expect(host.querySelector('button')?.hasAttribute('disabled')).toBe(true)
    host.removeAttribute('disabled')
    await flushObservers()
    expect(host.querySelector('button')?.hasAttribute('disabled')).toBe(false)
  })
})

describe('form controls', () => {
  it('renders an inner input and moves id onto it', () => {
    const host = mount(
      '<zui-input id="email" type="email" placeholder="you@example.com"></zui-input>',
    )
    const input = host.querySelector('input')
    expect(input?.className).toBe('zui-input')
    expect(input?.id).toBe('email')
    expect(host.hasAttribute('id')).toBe(false)
    expect(input?.getAttribute('type')).toBe('email')
    expect(input?.getAttribute('placeholder')).toBe('you@example.com')
  })

  it('proxies the value property', () => {
    const host = mount(
      '<zui-input value="hello"></zui-input>',
    ) as HTMLElement & { value: string }
    expect(host.value).toBe('hello')
    host.value = 'world'
    expect(host.querySelector('input')?.value).toBe('world')
  })

  it('moves options into the native select', () => {
    const host = mount(
      '<zui-select><option value="a">A</option><option value="b">B</option></zui-select>',
    )
    const select = host.querySelector('select')
    expect(select?.querySelectorAll('option')).toHaveLength(2)
  })

  it('renders checkbox as a classed label wrapping an input', () => {
    const host = mount('<zui-checkbox checked>Enable</zui-checkbox>')
    const label = host.querySelector('label')
    const input = host.querySelector('input')
    expect(label?.classList.contains('zui-checkbox')).toBe(true)
    expect(input?.type).toBe('checkbox')
    expect(input?.checked).toBe(true)
    expect(label?.textContent).toContain('Enable')
  })

  it('renders radio with the zui-radio class', () => {
    const host = mount('<zui-radio name="plan" value="pro">Pro</zui-radio>')
    const input = host.querySelector('input')
    expect(host.querySelector('label')?.classList.contains('zui-radio')).toBe(
      true,
    )
    expect(input?.type).toBe('radio')
    expect(input?.name).toBe('plan')
  })

  it('keeps the zui-label class on the host and associates via inner label', () => {
    const host = mount('<zui-label for="email">Email</zui-label>')
    expect(host.classList.contains('zui-label')).toBe(true)
    expect(host.querySelector('label')?.getAttribute('for')).toBe('email')
  })

  it('uses text children as the initial textarea value', async () => {
    const host = mount('<zui-textarea>Initial</zui-textarea>')
    await flushObservers()
    expect(host.querySelector('textarea')?.value).toBe('Initial')
    expect(host.childNodes).toHaveLength(1)
  })
})

describe('zui-dialog', () => {
  it('renders an inner native dialog with variant classes', () => {
    const host = mount(
      '<zui-dialog size="lg" position="right"><zui-dialog-body>Hi</zui-dialog-body></zui-dialog>',
    ) as ZuiDialog
    const dialog = host.querySelector('dialog')
    expect(dialog).toBeTruthy()
    expect(dialog?.classList.contains('zui-dialog')).toBe(true)
    expect(dialog?.classList.contains('zui-dialog-size-lg')).toBe(true)
    expect(dialog?.classList.contains('zui-dialog-position-right')).toBe(true)
    expect(dialog?.getAttribute('closedby')).toBe('any')
    expect(host.dialog).toBe(dialog)
    expect(
      dialog
        ?.querySelector('zui-dialog-body')
        ?.classList.contains('zui-dialog-body'),
    ).toBe(true)
  })
})

describe('zui-card', () => {
  it('is a class host by default', () => {
    const card = mount('<zui-card><zui-card-body>Hi</zui-card-body></zui-card>')
    expect(card.classList.contains('zui-card')).toBe(true)
    expect(card.querySelector('a')).toBeNull()
  })

  it('renders an interactive anchor card when href is set', () => {
    const card = mount('<zui-card href="/post">Read</zui-card>')
    const anchor = card.querySelector('a')
    expect(card.classList.contains('zui-card')).toBe(false)
    expect(anchor?.classList.contains('zui-card')).toBe(true)
    expect(anchor?.classList.contains('zui-card-interactive')).toBe(true)
    expect(anchor?.getAttribute('href')).toBe('/post')
  })
})

describe('zui-avatar', () => {
  it('renders fallback text and image', () => {
    const avatar = mount(
      '<zui-avatar src="/me.png" alt="Me" fallback="ZM" size="lg"></zui-avatar>',
    )
    expect(avatar.classList.contains('zui-avatar')).toBe(true)
    expect(avatar.classList.contains('zui-avatar-size-lg')).toBe(true)
    expect(avatar.querySelector('.zui-avatar-fallback')?.textContent).toBe('ZM')
    expect(avatar.querySelector('img')?.getAttribute('src')).toBe('/me.png')
  })
})

describe('zui-tabs', () => {
  function mountTabs(): HTMLElement {
    return mount(`
      <zui-tabs default-value="one">
        <zui-tabs-list>
          <zui-tabs-trigger value="one">One</zui-tabs-trigger>
          <zui-tabs-trigger value="two">Two</zui-tabs-trigger>
        </zui-tabs-list>
        <zui-tabs-content value="one">First</zui-tabs-content>
        <zui-tabs-content value="two">Second</zui-tabs-content>
      </zui-tabs>
    `)
  }

  it('wires roles, selection and panel visibility', async () => {
    const tabs = mountTabs()
    await flushObservers()

    expect(tabs.classList.contains('zui-tabs')).toBe(true)
    const triggers = tabs.querySelectorAll('button[data-zui-tabs-trigger]')
    expect(triggers).toHaveLength(2)
    expect(triggers[0].getAttribute('role')).toBe('tab')
    expect(triggers[0].getAttribute('aria-selected')).toBe('true')

    const panels = tabs.querySelectorAll<HTMLElement>('[data-zui-tabs-content]')
    expect(panels[0].hidden).toBe(false)
    expect(panels[1].hidden).toBe(true)
  })

  it('switches tabs on click and emits zui-tabs-change', async () => {
    const tabs = mountTabs() as ZuiTabs
    await flushObservers()

    let received: string | undefined
    tabs.addEventListener('zui-tabs-change', (event) => {
      received = (event as CustomEvent<{ value: string }>).detail.value
    })

    const second = tabs.querySelectorAll<HTMLButtonElement>(
      'button[data-zui-tabs-trigger]',
    )[1]
    second.click()

    expect(received).toBe('two')
    expect(tabs.value).toBe('two')
    const panels = tabs.querySelectorAll<HTMLElement>('[data-zui-tabs-content]')
    expect(panels[1].hidden).toBe(false)
  })
})

describe('zui-menu', () => {
  it('wires trigger, content and items', async () => {
    const menu = mount(`
      <zui-menu>
        <zui-menu-trigger>Open</zui-menu-trigger>
        <zui-menu-content>
          <zui-menu-item>Profile</zui-menu-item>
          <zui-menu-item href="/settings">Settings</zui-menu-item>
        </zui-menu-content>
      </zui-menu>
    `)
    await flushObservers()

    expect(menu.classList.contains('zui-menu')).toBe(true)
    const trigger = menu.querySelector('button[data-zui-menu-trigger]')
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger?.classList.contains('zui-button-variant-outline')).toBe(true)

    const content = menu.querySelector<HTMLElement>('[data-zui-menu-content]')
    expect(content?.hidden).toBe(true)

    const items = menu.querySelectorAll('[data-zui-menu-item]')
    expect(items).toHaveLength(2)
    expect(items[0].tagName).toBe('BUTTON')
    expect(items[1].tagName).toBe('A')
    ;(trigger as HTMLButtonElement).click()
    expect(content?.hidden).toBe(false)
  })
})

describe('zui-accordion & zui-collapsible', () => {
  it('decorates native details/summary children', () => {
    const accordion = mount(`
      <zui-accordion flush>
        <details name="faq"><summary>Q1</summary><div>A1</div></details>
        <details name="faq"><summary>Q2</summary><div>A2</div></details>
      </zui-accordion>
    `)
    expect(accordion.classList.contains('zui-accordion')).toBe(true)
    expect(accordion.classList.contains('zui-accordion-flush')).toBe(true)
    const items = accordion.querySelectorAll('details')
    expect(items[0].classList.contains('zui-accordion-item')).toBe(true)
    expect(
      items[0]
        .querySelector('summary')
        ?.classList.contains('zui-accordion-trigger'),
    ).toBe(true)
    expect(
      items[1]
        .querySelector('div')
        ?.classList.contains('zui-accordion-content'),
    ).toBe(true)
  })

  it('decorates a wrapped collapsible details', () => {
    const collapsible = mount(`
      <zui-collapsible>
        <details><summary>More</summary><div>Hidden</div></details>
      </zui-collapsible>
    `)
    const details = collapsible.querySelector('details')
    expect(details?.classList.contains('zui-collapsible')).toBe(true)
    expect(
      details
        ?.querySelector('summary')
        ?.classList.contains('zui-collapsible-trigger'),
    ).toBe(true)
  })
})

describe('zui-table', () => {
  it('decorates native table parts and later-added rows', async () => {
    const host = mount(`
      <zui-table>
        <table>
          <caption>People</caption>
          <thead><tr><th>Name</th></tr></thead>
          <tbody><tr><td>Ada</td></tr></tbody>
          <tfoot><tr><td>1 person</td></tr></tfoot>
        </table>
      </zui-table>
    `)
    expect(host.querySelector('table')?.classList.contains('zui-table')).toBe(
      true,
    )
    expect(
      host.querySelector('thead')?.classList.contains('zui-table-header'),
    ).toBe(true)
    expect(host.querySelector('th')?.classList.contains('zui-table-head')).toBe(
      true,
    )
    expect(
      host.querySelector('tfoot')?.classList.contains('zui-table-footer'),
    ).toBe(true)
    expect(
      host.querySelector('caption')?.classList.contains('zui-table-caption'),
    ).toBe(true)

    const row = document.createElement('tr')
    row.innerHTML = '<td>Grace</td>'
    host.querySelector('tbody')?.appendChild(row)
    await flushObservers()
    expect(row.classList.contains('zui-table-row')).toBe(true)
    expect(row.querySelector('td')?.classList.contains('zui-table-cell')).toBe(
      true,
    )
  })
})

describe('zui-tooltip', () => {
  it('renders trigger and popover content', () => {
    const tooltip = mount(
      '<zui-tooltip text="Hello" placement="bottom"><button>Trigger</button></zui-tooltip>',
    )
    expect(tooltip.classList.contains('zui-tooltip')).toBe(true)
    const content = tooltip.querySelector('[role="tooltip"]')
    expect(content?.textContent).toBe('Hello')
    expect(content?.getAttribute('popover')).toBe('manual')
    expect(content?.classList.contains('zui-tooltip-placement-bottom')).toBe(
      true,
    )
    expect(tooltip.querySelector('button')?.textContent).toBe('Trigger')
  })
})

describe('zui-popover', () => {
  it('is itself the popover element', () => {
    const popover = mount('<zui-popover id="pop">Content</zui-popover>')
    expect(popover.classList.contains('zui-popover')).toBe(true)
    expect(popover.getAttribute('popover')).toBe('auto')
  })
})

describe('zui-app-shell', () => {
  it('boots the controller and injects skip link and toggle', async () => {
    // jsdom has no matchMedia; the controller needs it to detect mobile mode.
    window.matchMedia ??= ((query: string) =>
      ({
        addEventListener: () => {},
        matches: false,
        media: query,
        removeEventListener: () => {},
      }) as unknown as MediaQueryList) as typeof window.matchMedia

    const shell = mount(`
      <zui-app-shell>
        <zui-app-shell-sidebar>
          <zui-app-shell-sidebar-body>Nav</zui-app-shell-sidebar-body>
        </zui-app-shell-sidebar>
        <zui-app-shell-header>Header</zui-app-shell-header>
        <zui-app-shell-main>Main</zui-app-shell-main>
      </zui-app-shell>
    `) as HTMLElement & { controller: unknown }
    await flushObservers()

    expect(shell.classList.contains('zui-app-shell')).toBe(true)
    expect(shell.querySelector('.zui-app-shell-skip-link')).toBeTruthy()
    expect(shell.controller).toBeTruthy()

    const sidebar = shell.querySelector('zui-app-shell-sidebar')
    expect(sidebar?.classList.contains('zui-app-shell-sidebar')).toBe(true)
    expect(sidebar?.getAttribute('popover')).toBe('auto')
    expect(sidebar?.id).toBe('zui-app-shell-sidebar')

    const main = shell.querySelector('zui-app-shell-main')
    expect(main?.getAttribute('role')).toBe('main')

    expect(shell.querySelector('[data-zui-app-shell-toggle]')).toBeTruthy()
  })
})
