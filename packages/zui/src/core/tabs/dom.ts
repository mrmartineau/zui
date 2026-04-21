import {
  createTabsContentId,
  createTabsRootId,
  createTabsTriggerId,
} from './ids'
import { createTabsController } from './controller'
import type { TabsControllerApi, TabsRootOptions } from './types'

const ROOT_SELECTOR = '[data-zui-tabs-root]'
const TRIGGER_SELECTOR = '[data-zui-tabs-trigger]'
const CONTENT_SELECTOR = '[data-zui-tabs-content]'

export interface TabsDomController {
  controller: TabsControllerApi
  destroy(): void
  sync(): void
}

function getTriggerValue(element: Element) {
  return element.getAttribute('data-value')
}

function isTriggerOwnDisabled(trigger: HTMLElement) {
  return trigger.dataset.zuiTabsOwnDisabled === 'true'
}

function applySnapshot(root: HTMLElement, controller: TabsControllerApi) {
  const snapshot = controller.getSnapshot()
  root.dataset.orientation = snapshot.orientation

  if (snapshot.disabled) root.dataset.disabled = 'true'
  else delete root.dataset.disabled

  const triggers = root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)
  const contents = root.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)

  for (const trigger of triggers) {
    const value = getTriggerValue(trigger)
    const isActive = snapshot.selectedValue === value
    const isDisabled = snapshot.disabled || isTriggerOwnDisabled(trigger)

    trigger.dataset.orientation = snapshot.orientation
    trigger.dataset.state = isActive ? 'active' : 'inactive'
    if (isDisabled) trigger.dataset.disabled = 'true'
    else delete trigger.dataset.disabled

    if (isDisabled) {
      trigger.setAttribute('disabled', '')
    } else {
      trigger.removeAttribute('disabled')
    }

    trigger.setAttribute('role', 'tab')
    trigger.setAttribute('aria-selected', isActive ? 'true' : 'false')
    trigger.tabIndex = isActive ? 0 : -1
  }

  for (const content of contents) {
    const value = getTriggerValue(content)
    const isActive = snapshot.selectedValue === value
    content.dataset.orientation = snapshot.orientation
    content.dataset.state = isActive ? 'active' : 'inactive'
    content.setAttribute('role', 'tabpanel')
    content.hidden = !isActive
  }

  const list = root.querySelector<HTMLElement>('[data-zui-tabs-list]')
  if (list) {
    list.dataset.orientation = snapshot.orientation
    list.setAttribute('role', 'tablist')
    if (snapshot.orientation === 'vertical') {
      list.setAttribute('aria-orientation', 'vertical')
    } else {
      list.removeAttribute('aria-orientation')
    }
  }
}

export function attachTabsDom(
  root: HTMLElement,
  options: TabsRootOptions = {},
): TabsDomController {
  const rootId = createTabsRootId(options.id ?? (root.id || undefined))
  const controller = createTabsController({
    ...options,
    id: rootId,
    orientation:
      (root.dataset.orientation as TabsRootOptions['orientation']) ??
      options.orientation,
  })

  root.id = rootId
  root.dataset.zuiTabsRoot = ''
  root.classList.add('zui-tabs')

  const cleanups = new Set<() => void>()
  let syncing = false

  function sync() {
    if (syncing) return
    syncing = true
    for (const cleanup of cleanups) cleanup()
    cleanups.clear()

    const triggers = [...root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)]
    const contents = [...root.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)]

    triggers.forEach((trigger, order) => {
      const value = getTriggerValue(trigger)
      if (value == null) return

      const triggerId = trigger.id || createTabsTriggerId(rootId, value)
      const panelId = createTabsContentId(rootId, value)
      const ownDisabled =
        trigger.dataset.zuiTabsDisabledByRoot === 'true'
          ? false
          : trigger.hasAttribute('disabled')

      trigger.id = triggerId
      trigger.dataset.zuiTabsOwnDisabled = ownDisabled ? 'true' : 'false'
      delete trigger.dataset.zuiTabsDisabledByRoot
      trigger.setAttribute('type', 'button')
      trigger.setAttribute('aria-controls', panelId)

      const unregister = controller.registerTrigger({
        disabled: ownDisabled,
        element: trigger,
        order,
        panelId,
        triggerId,
        value,
      })

      const onClick = () => controller.clickTrigger(value)
      const onFocus = () => controller.focusTrigger(value)
      const onBlur = () => controller.blurTrigger(value)
      const onKeydown = (event: KeyboardEvent) =>
        controller.handleTriggerKeydown(event, value)

      trigger.addEventListener('click', onClick)
      trigger.addEventListener('focus', onFocus)
      trigger.addEventListener('blur', onBlur)
      trigger.addEventListener('keydown', onKeydown)

      cleanups.add(() => {
        if (trigger.hasAttribute('disabled') && !isTriggerOwnDisabled(trigger)) {
          trigger.dataset.zuiTabsDisabledByRoot = 'true'
        } else {
          delete trigger.dataset.zuiTabsDisabledByRoot
        }

        unregister()
        trigger.removeEventListener('click', onClick)
        trigger.removeEventListener('focus', onFocus)
        trigger.removeEventListener('blur', onBlur)
        trigger.removeEventListener('keydown', onKeydown)
      })
    })

    contents.forEach((content) => {
      const value = getTriggerValue(content)
      if (value == null) return

      const triggerId = createTabsTriggerId(rootId, value)
      const panelId = content.id || createTabsContentId(rootId, value)

      content.id = panelId
      content.setAttribute('aria-labelledby', triggerId)

      const unregister = controller.registerContent({
        element: content,
        panelId,
        triggerId,
        value,
      })

      cleanups.add(unregister)
    })

    applySnapshot(root, controller)
    syncing = false
  }

  const observer = new MutationObserver((mutations) => {
    const shouldSync = mutations.some((mutation) => {
      if (mutation.type === 'childList') return true
      if (mutation.type !== 'attributes') return false
      return (
        mutation.attributeName === 'data-value' ||
        mutation.attributeName === 'disabled'
      )
    })

    if (shouldSync) sync()
  })

  observer.observe(root, {
    attributeFilter: ['data-value', 'disabled'],
    attributes: true,
    childList: true,
    subtree: true,
  })

  const unsubscribe = controller.subscribe(() => applySnapshot(root, controller))

  sync()

  return {
    controller,
    destroy() {
      observer.disconnect()
      unsubscribe()
      for (const cleanup of cleanups) cleanup()
      cleanups.clear()
    },
    sync,
  }
}

export function autoAttachTabsDom(options: TabsRootOptions = {}) {
  const instances = [...document.querySelectorAll<HTMLElement>(ROOT_SELECTOR)].map(
    (root) => attachTabsDom(root, options),
  )

  return () => {
    for (const instance of instances) instance.destroy()
  }
}
