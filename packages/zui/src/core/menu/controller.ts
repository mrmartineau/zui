import { createMenuContentId, createMenuRootId, createMenuTriggerId } from './ids'
import { getContentKeyboardIntent, getTriggerKeyboardIntent } from './keyboard'
import { MenuRegistry } from './registry'
import { appendTypeaheadCharacter, findTypeaheadMatch } from './typeahead'
import type {
  MenuControllerApi,
  MenuFocusTarget,
  MenuItemRegistration,
  MenuRootOptions,
  MenuSnapshot,
} from './types'

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

const DEFAULTS = {
  align: 'start',
  dir: 'ltr',
  disabled: false,
  modal: false,
  side: 'bottom',
} as const

export function createMenuController(
  initialOptions: MenuRootOptions = {},
): MenuControllerApi {
  const registry = new MenuRegistry()
  const listeners = new Set<(snapshot: MenuSnapshot) => void>()
  const rootId = createMenuRootId(initialOptions.id)
  const triggerId = createMenuTriggerId(rootId)
  const contentId = createMenuContentId(rootId)

  let options: Required<
    Pick<MenuRootOptions, 'align' | 'dir' | 'disabled' | 'modal' | 'side'>
  > &
    Omit<MenuRootOptions, 'align' | 'dir' | 'disabled' | 'modal' | 'side'> = {
    ...DEFAULTS,
    ...initialOptions,
    id: rootId,
  }

  let open = initialOptions.open ?? initialOptions.defaultOpen ?? false
  let highlightedItemId: string | null = null
  let typeaheadState = { buffer: '', timestamp: 0 }

  function isControlled() {
    return options.open !== undefined
  }

  function getCurrentOpen() {
    return isControlled() ? options.open ?? false : open
  }

  function getTriggerDisabled() {
    return options.disabled || registry.getTrigger()?.disabled || false
  }

  function getSnapshot(): MenuSnapshot {
    return {
      align: options.align ?? DEFAULTS.align,
      contentId,
      dir: options.dir ?? DEFAULTS.dir,
      disabled: options.disabled ?? DEFAULTS.disabled,
      highlightedItemId,
      modal: options.modal ?? DEFAULTS.modal,
      open: getCurrentOpen(),
      rootId,
      side: options.side ?? DEFAULTS.side,
      triggerDisabled: getTriggerDisabled(),
      triggerId,
    }
  }

  function emit() {
    const snapshot = getSnapshot()
    for (const listener of listeners) listener(snapshot)
  }

  function getEnabledItems() {
    return registry.getEnabledItems()
  }

  function resolveFocusableItem(target: MenuFocusTarget, currentId = highlightedItemId) {
    const items = getEnabledItems()
    if (items.length === 0) return null

    if (target === 'first' || target == null) return items[0] ?? null
    if (target === 'last') return items.at(-1) ?? null

    const currentIndex = currentId == null ? -1 : items.findIndex((item) => item.id === currentId)
    if (target === 'next') {
      return items[(currentIndex + 1 + items.length) % items.length] ?? null
    }
    if (target === 'previous') {
      return items[(currentIndex - 1 + items.length) % items.length] ?? null
    }
    return null
  }

  function setHighlightedItemId(nextId: string | null) {
    if (highlightedItemId === nextId) return false
    highlightedItemId = nextId
    emit()
    return true
  }

  function focusItemElement(item: MenuItemRegistration | null) {
    item?.element?.focus()
  }

  function focusResolvedItem(target: MenuFocusTarget, currentId = highlightedItemId) {
    const item = resolveFocusableItem(target, currentId)
    if (!item) return false
    const changed = setHighlightedItemId(item.id)
    focusItemElement(item)
    return changed || true
  }

  function setOpen(nextOpen: boolean) {
    const previousOpen = getCurrentOpen()
    if (previousOpen === nextOpen) return false

    if (!isControlled()) {
      open = nextOpen
    }

    if (!nextOpen) {
      highlightedItemId = null
      typeaheadState = { buffer: '', timestamp: 0 }
    }

    options.onOpenChange?.(nextOpen)
    emit()
    return true
  }

  function openMenu(options?: { focus?: MenuFocusTarget }) {
    if (getTriggerDisabled()) return false
    const changed = setOpen(true)
    const focusTarget = options?.focus ?? 'first'
    if (focusTarget) {
      focusResolvedItem(focusTarget)
    }
    return changed
  }

  function closeMenu(closeOptions?: { restoreFocus?: boolean }) {
    const changed = setOpen(false)
    if (!getCurrentOpen() && !changed) return false
    if (closeOptions?.restoreFocus !== false) {
      registry.getTrigger()?.element?.focus()
    }
    return true
  }

  function toggleMenu(toggleOptions?: { focus?: 'first' | 'last' | null }) {
    if (getCurrentOpen()) {
      return closeMenu({ restoreFocus: true })
    }
    return openMenu({ focus: toggleOptions?.focus ?? 'first' })
  }

  function focusItem(id: string) {
    const item = registry.getItem(id)
    if (options.disabled || !item || item.disabled || !getCurrentOpen()) return false
    const changed = setHighlightedItemId(id)
    focusItemElement(item)
    return changed || true
  }

  function focusFirstItem() {
    return focusResolvedItem('first')
  }

  function focusLastItem() {
    return focusResolvedItem('last')
  }

  function focusNextItem(currentId?: string | null) {
    return focusResolvedItem('next', currentId)
  }

  function focusPreviousItem(currentId?: string | null) {
    return focusResolvedItem('previous', currentId)
  }

  function selectItem(id: string) {
    if (options.disabled || !getCurrentOpen()) return false
    const item = registry.getItem(id)
    if (!item || item.disabled) return false
    closeMenu({ restoreFocus: true })
    return true
  }

  function handleTriggerClick() {
    if (getTriggerDisabled()) return
    toggleMenu({ focus: 'first' })
  }

  function handleTriggerKeydown(event: KeyboardEvent) {
    if (getTriggerDisabled()) return
    const intent = getTriggerKeyboardIntent(event.key)
    if (intent === 'none') return
    event.preventDefault()
    openMenu({ focus: intent === 'open-last' ? 'last' : 'first' })
  }

  function handleContentKeydown(event: KeyboardEvent) {
    if (!getCurrentOpen()) return

    const intent = getContentKeyboardIntent(event.key, options.dir ?? DEFAULTS.dir)
    if (intent !== 'none') {
      if (intent === 'close') {
        event.preventDefault()
        closeMenu({ restoreFocus: true })
        return
      }
      if (intent === 'tab') {
        closeMenu({ restoreFocus: false })
        return
      }
      if (intent === 'first') {
        event.preventDefault()
        focusFirstItem()
        return
      }
      if (intent === 'last') {
        event.preventDefault()
        focusLastItem()
        return
      }
      if (intent === 'next') {
        event.preventDefault()
        focusNextItem()
        return
      }
      if (intent === 'previous') {
        event.preventDefault()
        focusPreviousItem()
        return
      }
      if (intent === 'select' && highlightedItemId) {
        event.preventDefault()
        const item = registry.getItem(highlightedItemId)
        if (item && !item.disabled) {
          item.element?.click()
        }
        return
      }
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const matched = handleItemTextInput(event.key)
      if (matched) {
        event.preventDefault()
      }
    }
  }

  function handleDocumentPointerDown(target: EventTarget | null) {
    if (!getCurrentOpen()) return
    if (!(target instanceof Node)) return

    const trigger = registry.getTrigger()?.element
    const content = registry.getContent()?.element
    if (trigger?.contains(target) || content?.contains(target)) return
    closeMenu({ restoreFocus: false })
  }

  function handleItemPointerEnter(id: string) {
    if (options.disabled || !getCurrentOpen()) return
    const item = registry.getItem(id)
    if (!item || item.disabled) return
    setHighlightedItemId(id)
  }

  function handleItemTextInput(character: string) {
    if (options.disabled) return false
    typeaheadState = appendTypeaheadCharacter(typeaheadState, character)
    const match = findTypeaheadMatch(getEnabledItems(), typeaheadState.buffer, highlightedItemId)
    if (!match) return false
    const changed = setHighlightedItemId(match.id)
    focusItemElement(match)
    return changed || true
  }

  function registerTrigger(registration: { disabled: boolean; element: HTMLElement | null; triggerId: string }) {
    if (registry.getTrigger() && registry.getTrigger() !== registration) {
      warn(`Duplicate MenuTrigger detected in root "${rootId}".`)
    }
    const unregister = registry.registerTrigger(registration)
    emit()
    return () => {
      unregister()
      emit()
    }
  }

  function registerContent(registration: { contentId: string; element: HTMLElement | null }) {
    if (registry.getContent() && registry.getContent() !== registration) {
      warn(`Duplicate MenuContent detected in root "${rootId}".`)
    }
    const unregister = registry.registerContent(registration)
    emit()
    return () => {
      unregister()
      emit()
    }
  }

  function registerItem(registration: MenuItemRegistration) {
    const existingItem = registry.getItem(registration.id)
    if (existingItem && existingItem !== registration) {
      warn(`Duplicate MenuItem id "${registration.id}" detected in root "${rootId}".`)
    }
    const unregister = registry.registerItem(registration)
    if (highlightedItemId != null && !registry.getItem(highlightedItemId)) {
      highlightedItemId = null
    }
    emit()
    return () => {
      unregister()
      if (highlightedItemId === registration.id) {
        highlightedItemId = null
      }
      emit()
    }
  }

  function setOptions(nextOptions: MenuRootOptions) {
    if (nextOptions.id && nextOptions.id !== rootId) {
      warn(`Menu root id cannot change after initialization. Ignoring new id "${nextOptions.id}".`)
    }

    options = {
      ...options,
      ...nextOptions,
      id: rootId,
    }

    if (!getCurrentOpen()) {
      typeaheadState = { buffer: '', timestamp: 0 }
    }

    if (!getCurrentOpen()) {
      highlightedItemId = null
    } else if (highlightedItemId != null && !registry.getItem(highlightedItemId)) {
      highlightedItemId = null
    }

    emit()
  }

  function subscribe(listener: (snapshot: MenuSnapshot) => void) {
    listeners.add(listener)
    listener(getSnapshot())
    return () => {
      listeners.delete(listener)
    }
  }

  return {
    closeMenu,
    focusFirstItem,
    focusItem,
    focusLastItem,
    focusNextItem,
    focusPreviousItem,
    getContent: () => registry.getContent(),
    getItem: (id) => registry.getItem(id),
    getItems: () => registry.getItems(),
    getSnapshot,
    getTrigger: () => registry.getTrigger(),
    handleContentKeydown,
    handleDocumentPointerDown,
    handleItemPointerEnter,
    handleItemTextInput,
    handleTriggerClick,
    handleTriggerKeydown,
    openMenu,
    registerContent,
    registerItem,
    registerTrigger,
    selectItem,
    setOptions,
    subscribe,
    toggleMenu,
  }
}
