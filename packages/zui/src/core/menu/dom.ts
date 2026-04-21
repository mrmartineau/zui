import {
  createMenuContentId,
  createMenuItemId,
  createMenuRootId,
  createMenuTriggerId,
} from './ids'
import { createMenuController } from './controller'
import type { MenuControllerApi, MenuRootOptions } from './types'

const MENU_DOM_INSTANCE = Symbol('zui.menu.dom.instance')
const TRIGGER_SELECTOR = '[data-zui-menu-trigger]'
const CONTENT_SELECTOR = '[data-zui-menu-content]'
const ITEM_SELECTOR = '[data-zui-menu-item]'

export interface MenuDomController {
  controller: MenuControllerApi
  destroy(): void
  sync(): void
}

function isDevelopment() {
  return (
    (globalThis as typeof globalThis & {
      process?: { env?: { NODE_ENV?: string } }
    }).process?.env?.NODE_ENV !== 'production'
  )
}

function warn(message: string) {
  if (isDevelopment()) {
    console.warn(`[zui/menu] ${message}`)
  }
}

function isItemOwnDisabled(item: HTMLElement) {
  return item.dataset.zuiMenuOwnDisabled === 'true'
}

function readRootOptions(root: HTMLElement, options: MenuRootOptions, rootId: string) {
  return {
    align: (root.dataset.align as MenuRootOptions['align']) ?? options.align,
    defaultOpen:
      root.dataset.defaultOpen === 'true'
        ? true
        : root.dataset.defaultOpen === 'false'
          ? false
          : options.defaultOpen,
    dir: (root.dataset.dir as MenuRootOptions['dir']) ?? options.dir,
    disabled:
      root.dataset.disabled === 'true' ? true : (options.disabled ?? false),
    id: rootId,
    open:
      root.dataset.open === 'true'
        ? true
        : root.dataset.open === 'false'
          ? false
          : options.open,
    side: (root.dataset.side as MenuRootOptions['side']) ?? options.side,
  } satisfies MenuRootOptions
}

function applySnapshot(root: HTMLElement, controller: MenuControllerApi) {
  const snapshot = controller.getSnapshot()
  root.classList.add('zui-menu')
  root.dataset.state = snapshot.open ? 'open' : 'closed'
  if (snapshot.disabled) root.dataset.disabled = 'true'
  else delete root.dataset.disabled

  const trigger = root.querySelector<HTMLElement>(TRIGGER_SELECTOR)
  if (trigger) {
    trigger.classList.add('zui-menu-trigger')
    trigger.id = snapshot.triggerId
    trigger.dataset.state = snapshot.open ? 'open' : 'closed'
    if (snapshot.triggerDisabled) trigger.dataset.disabled = 'true'
    else delete trigger.dataset.disabled
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-expanded', snapshot.open ? 'true' : 'false')
    trigger.setAttribute('aria-controls', snapshot.contentId)
    if (snapshot.triggerDisabled) trigger.setAttribute('disabled', '')
    else if (!isItemOwnDisabled(trigger)) trigger.removeAttribute('disabled')
  }

  const content = root.querySelector<HTMLElement>(CONTENT_SELECTOR)
  if (content) {
    content.classList.add('zui-menu-content')
    content.id = snapshot.contentId
    content.dataset.state = snapshot.open ? 'open' : 'closed'
    content.dataset.side = snapshot.side
    content.dataset.align = snapshot.align
    content.hidden = !snapshot.open
    content.setAttribute('role', 'menu')
    content.setAttribute('aria-labelledby', snapshot.triggerId)
  }

  const items = root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)
  for (const item of items) {
    const highlighted = snapshot.highlightedItemId === item.id
    item.classList.add('zui-menu-item')
    if (highlighted) item.dataset.highlighted = 'true'
    else delete item.dataset.highlighted
    const ownDisabled = isItemOwnDisabled(item)
    const disabled = snapshot.disabled || ownDisabled
    if (disabled) item.dataset.disabled = 'true'
    else delete item.dataset.disabled
    item.setAttribute('role', 'menuitem')
    item.tabIndex = snapshot.open && highlighted ? 0 : -1
    if (item.tagName === 'BUTTON') {
      if (disabled) item.setAttribute('disabled', '')
      else if (!ownDisabled) item.removeAttribute('disabled')
    } else if (disabled) {
      item.setAttribute('aria-disabled', 'true')
    } else {
      item.removeAttribute('aria-disabled')
    }
  }
}

export function attachMenuDom(
  root: HTMLElement,
  options: MenuRootOptions = {},
): MenuDomController {
  const existingInstance = (
    root as HTMLElement & { [MENU_DOM_INSTANCE]?: MenuDomController }
  )[MENU_DOM_INSTANCE]

  if (existingInstance) {
    warn(
      `Menu root "${root.id || '(no id)'}" was initialized more than once. Reusing existing instance.`,
    )
    return existingInstance
  }

  const rootId = createMenuRootId(options.id ?? root.id ?? undefined)
  const controller = createMenuController(readRootOptions(root, options, rootId))

  root.id = rootId
  root.dataset.zuiMenuRoot = ''

  const cleanups = new Set<() => void>()
  let syncing = false
  let observer: MutationObserver | null = null
  let observerPauseDepth = 0

  function observeMutations() {
    if (observerPauseDepth > 0) return
    observer?.observe(root, {
      attributeFilter: [
        'data-align',
        'data-dir',
        'data-disabled',
        'data-open',
        'data-side',
        'data-text-value',
        'disabled',
        'id',
      ],
      attributes: true,
      childList: true,
      subtree: true,
    })
  }

  function withObserverPaused(callback: () => void) {
    observerPauseDepth += 1
    observer?.disconnect()
    try {
      callback()
    } finally {
      observerPauseDepth -= 1
      if (observerPauseDepth === 0) {
        observeMutations()
      }
    }
  }

  function sync() {
    if (syncing) return
    syncing = true

    withObserverPaused(() => {
      controller.setOptions(readRootOptions(root, options, rootId))

      for (const cleanup of cleanups) cleanup()
      cleanups.clear()

      const triggers = [...root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)]
      const contents = [...root.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)]

      if (triggers.length === 0) {
        warn(`Menu root "${rootId}" has no MenuTrigger.`)
      }
      if (contents.length === 0) {
        warn(`Menu root "${rootId}" has no MenuContent.`)
      }
      if (triggers.length > 1) {
        warn(
          `Menu root "${rootId}" has multiple MenuTrigger elements. Only the first will be used.`,
        )
      }
      if (contents.length > 1) {
        warn(
          `Menu root "${rootId}" has multiple MenuContent elements. Only the first will be used.`,
        )
      }

      const trigger = triggers[0]
      if (trigger) {
        const ownDisabled =
          trigger.dataset.zuiMenuDisabledByRoot === 'true'
            ? false
            : trigger.hasAttribute('disabled')

        trigger.dataset.zuiMenuOwnDisabled = ownDisabled ? 'true' : 'false'
        delete trigger.dataset.zuiMenuDisabledByRoot
        trigger.id = trigger.id || createMenuTriggerId(rootId)
        if (trigger instanceof HTMLButtonElement && !trigger.getAttribute('type')) {
          trigger.setAttribute('type', 'button')
        }

        const unregister = controller.registerTrigger({
          disabled: ownDisabled,
          element: trigger,
          triggerId: trigger.id,
        })

        const onClick = () => controller.handleTriggerClick()
        const onKeydown = (event: KeyboardEvent) =>
          controller.handleTriggerKeydown(event)
        trigger.addEventListener('click', onClick)
        trigger.addEventListener('keydown', onKeydown)

        cleanups.add(() => {
          if (trigger.hasAttribute('disabled') && !isItemOwnDisabled(trigger)) {
            trigger.dataset.zuiMenuDisabledByRoot = 'true'
          } else {
            delete trigger.dataset.zuiMenuDisabledByRoot
          }
          unregister()
          trigger.removeEventListener('click', onClick)
          trigger.removeEventListener('keydown', onKeydown)
        })
      }

      const content = contents[0]
      if (content) {
        content.id = content.id || createMenuContentId(rootId)
        const unregister = controller.registerContent({
          contentId: content.id,
          element: content,
        })
        const onKeydown = (event: KeyboardEvent) =>
          controller.handleContentKeydown(event)
        content.addEventListener('keydown', onKeydown)
        cleanups.add(() => {
          unregister()
          content.removeEventListener('keydown', onKeydown)
        })
      }

      const items = [...root.querySelectorAll<HTMLElement>(ITEM_SELECTOR)]
      items.forEach((item, order) => {
        const ownDisabled =
          item.dataset.zuiMenuDisabledByRoot === 'true'
            ? false
            : item.hasAttribute('disabled')
        item.dataset.zuiMenuOwnDisabled = ownDisabled ? 'true' : 'false'
        delete item.dataset.zuiMenuDisabledByRoot
        item.id = item.id || createMenuItemId(rootId)

        const unregister = controller.registerItem({
          disabled: ownDisabled,
          element: item,
          id: item.id,
          kind: item.tagName === 'A' ? 'link' : 'button',
          order,
          textValue: item.dataset.textValue || undefined,
        })

        const onClick = (event: MouseEvent) => {
          if (!controller.selectItem(item.id)) {
            event.preventDefault()
          }
        }
        const onFocus = () => controller.focusItem(item.id)
        const onPointerEnter = () => controller.handleItemPointerEnter(item.id)
        item.addEventListener('click', onClick)
        item.addEventListener('focus', onFocus)
        item.addEventListener('pointerenter', onPointerEnter)

        cleanups.add(() => {
          if (item.hasAttribute('disabled') && !isItemOwnDisabled(item)) {
            item.dataset.zuiMenuDisabledByRoot = 'true'
          } else {
            delete item.dataset.zuiMenuDisabledByRoot
          }
          unregister()
          item.removeEventListener('click', onClick)
          item.removeEventListener('focus', onFocus)
          item.removeEventListener('pointerenter', onPointerEnter)
        })
      })

      applySnapshot(root, controller)
    })

    syncing = false
  }

  observer = new MutationObserver((mutations) => {
    const shouldSync = mutations.some((mutation) => {
      if (mutation.type === 'childList') return true
      if (mutation.type !== 'attributes') return false
      return (
        mutation.attributeName === 'data-align' ||
        mutation.attributeName === 'data-dir' ||
        mutation.attributeName === 'data-disabled' ||
        mutation.attributeName === 'data-open' ||
        mutation.attributeName === 'data-side' ||
        mutation.attributeName === 'data-text-value' ||
        mutation.attributeName === 'disabled' ||
        mutation.attributeName === 'id'
      )
    })

    if (shouldSync) sync()
  })

  observeMutations()

  const onPointerDown = (event: PointerEvent) =>
    controller.handleDocumentPointerDown(event.target)
  document.addEventListener('pointerdown', onPointerDown)

  const unsubscribe = controller.subscribe(() => {
    withObserverPaused(() => applySnapshot(root, controller))
  })

  sync()

  const instance: MenuDomController = {
    controller,
    destroy() {
      observer?.disconnect()
      unsubscribe()
      document.removeEventListener('pointerdown', onPointerDown)
      for (const cleanup of cleanups) cleanup()
      cleanups.clear()
      delete (root as HTMLElement & { [MENU_DOM_INSTANCE]?: MenuDomController })[
        MENU_DOM_INSTANCE
      ]
    },
    sync,
  }

  ;(root as HTMLElement & { [MENU_DOM_INSTANCE]?: MenuDomController })[
    MENU_DOM_INSTANCE
  ] = instance

  return instance
}
