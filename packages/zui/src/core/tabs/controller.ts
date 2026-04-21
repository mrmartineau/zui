import {
  getTabsKeyboardIntent,
  getNextEnabledValue,
  getPreviousEnabledValue,
} from './keyboard'
import { TabsRegistry } from './registry'
import type {
  TabsContentRegistration,
  TabsControllerApi,
  TabsRootOptions,
  TabsSnapshot,
  TabsTriggerRegistration,
} from './types'
import { createTabsRootId } from './ids'

function isDevelopment() {
  return (
    (globalThis as typeof globalThis & {
      process?: { env?: { NODE_ENV?: string } }
    }).process?.env?.NODE_ENV !== 'production'
  )
}

function warn(message: string) {
  if (isDevelopment()) {
    console.warn(`[zui/tabs] ${message}`)
  }
}

const DEFAULTS = {
  activationMode: 'auto',
  dir: 'ltr',
  disabled: false,
  orientation: 'horizontal',
} as const

export function createTabsController(
  initialOptions: TabsRootOptions = {},
): TabsControllerApi {
  const registry = new TabsRegistry()
  const listeners = new Set<(snapshot: TabsSnapshot) => void>()

  const rootId = createTabsRootId(initialOptions.id)

  let options: Required<
    Pick<TabsRootOptions, 'activationMode' | 'dir' | 'disabled' | 'orientation'>
  > &
    Omit<TabsRootOptions, 'activationMode' | 'dir' | 'disabled' | 'orientation'> = {
    ...DEFAULTS,
    ...initialOptions,
    id: rootId,
  }

  let selectedValue = initialOptions.value ?? initialOptions.defaultValue ?? null
  let focusedValue = selectedValue

  function getEnabledTriggers() {
    return registry.getEnabledTriggers()
  }

  function resolveSelectedValue(candidate: string | null) {
    if (candidate && registry.getTrigger(candidate) && !registry.getTrigger(candidate)?.disabled) {
      return candidate
    }
    return registry.getFirstEnabledValue()
  }

  function emit() {
    const snapshot = getSnapshot()
    for (const listener of listeners) listener(snapshot)
  }

  function isControlled() {
    return options.value !== undefined
  }

  function getCurrentSelectedValue() {
    return isControlled() ? options.value ?? null : selectedValue
  }

  function setFocusedValue(value: string | null) {
    focusedValue = value
  }

  function setSelectedValue(nextValue: string | null) {
    const resolved = resolveSelectedValue(nextValue)
    const previous = getCurrentSelectedValue()

    if (!isControlled()) {
      selectedValue = resolved
    }

    if (resolved && previous !== resolved) {
      options.onValueChange?.(resolved)
    }

    if (resolved !== previous || focusedValue !== resolved) {
      focusedValue = resolved
      emit()
    }
  }

  function getSnapshot(): TabsSnapshot {
    return {
      activationMode: options.activationMode ?? DEFAULTS.activationMode,
      dir: options.dir ?? DEFAULTS.dir,
      disabled: options.disabled ?? DEFAULTS.disabled,
      focusedValue,
      orientation: options.orientation ?? DEFAULTS.orientation,
      rootId,
      selectedValue: getCurrentSelectedValue(),
    }
  }

  function focusTriggerElement(value: string | null) {
    if (!value) return
    registry.getTrigger(value)?.element?.focus()
  }

  function moveFocus(targetValue: string | null) {
    if (!targetValue) return
    setFocusedValue(targetValue)
    emit()
    focusTriggerElement(targetValue)

    if (options.activationMode === 'auto') {
      setSelectedValue(targetValue)
    }
  }

  function registerTrigger(registration: TabsTriggerRegistration) {
    const existingTrigger = registry.getTrigger(registration.value)
    if (existingTrigger && existingTrigger !== registration) {
      warn(`Duplicate TabsTrigger value "${registration.value}" detected in root "${rootId}".`)
    }

    const unregister = registry.registerTrigger(registration)
    const currentSelected = getCurrentSelectedValue()
    const nextSelected = resolveSelectedValue(currentSelected)

    if (!isControlled()) {
      selectedValue = nextSelected
    }

    if (!focusedValue) {
      focusedValue = nextSelected
    }

    emit()

    return () => {
      unregister()
      const remainingSelected = resolveSelectedValue(getCurrentSelectedValue())
      if (!isControlled()) {
        selectedValue = remainingSelected
      }
      if (focusedValue && !registry.getTrigger(focusedValue)) {
        focusedValue = remainingSelected
      }
      emit()
    }
  }

  function registerContent(registration: TabsContentRegistration) {
    const existingContent = registry.getContent(registration.value)
    if (existingContent && existingContent !== registration) {
      warn(`Duplicate TabsContent value "${registration.value}" detected in root "${rootId}".`)
    }

    const unregister = registry.registerContent(registration)
    emit()
    return () => {
      unregister()
      emit()
    }
  }

  function selectValue(value: string) {
    if (options.disabled) return
    const trigger = registry.getTrigger(value)
    if (!trigger || trigger.disabled) return
    setSelectedValue(value)
  }

  function handleTriggerKeydown(event: KeyboardEvent, value: string) {
    if (options.disabled) return

    const intent = getTabsKeyboardIntent(event.key, {
      dir: options.dir ?? DEFAULTS.dir,
      orientation: options.orientation ?? DEFAULTS.orientation,
    })

    if (intent === 'none') return

    const enabledTriggers = getEnabledTriggers()
    let targetValue: string | null = null

    if (intent === 'select-focused') {
      event.preventDefault()
      selectValue(value)
      return
    }

    if (intent === 'first') {
      targetValue = enabledTriggers[0]?.value ?? null
    }

    if (intent === 'last') {
      targetValue = enabledTriggers[enabledTriggers.length - 1]?.value ?? null
    }

    if (intent === 'next') {
      targetValue = getNextEnabledValue(enabledTriggers, value)
    }

    if (intent === 'previous') {
      targetValue = getPreviousEnabledValue(enabledTriggers, value)
    }

    if (!targetValue) return

    event.preventDefault()
    moveFocus(targetValue)
  }

  function focusTrigger(value: string) {
    if (options.disabled) return
    const trigger = registry.getTrigger(value)
    if (!trigger || trigger.disabled) return
    setFocusedValue(value)
    emit()
  }

  function blurTrigger(value: string) {
    if (focusedValue === value) {
      focusedValue = getCurrentSelectedValue()
      emit()
    }
  }

  function clickTrigger(value: string) {
    selectValue(value)
    setFocusedValue(value)
    emit()
  }

  function setOptions(nextOptions: TabsRootOptions) {
    if (nextOptions.id && nextOptions.id !== rootId) {
      warn(`Tabs root id cannot change after initialization. Ignoring new id "${nextOptions.id}".`)
    }
    options = {
      ...options,
      ...nextOptions,
      id: nextOptions.id ?? options.id,
    }

    if (!isControlled() && nextOptions.defaultValue && !selectedValue) {
      selectedValue = resolveSelectedValue(nextOptions.defaultValue)
    }

    const resolved = resolveSelectedValue(getCurrentSelectedValue())
    if ((options.value ?? null) && !registry.getTrigger(options.value ?? '')) {
      warn(`Controlled Tabs value "${options.value}" has no matching trigger in root "${rootId}".`)
    }
    if (!isControlled()) {
      selectedValue = resolved
    }
    if (!focusedValue || !registry.getTrigger(focusedValue)) {
      focusedValue = resolved
    }
    emit()
  }

  function subscribe(listener: (snapshot: TabsSnapshot) => void) {
    listeners.add(listener)
    listener(getSnapshot())
    return () => {
      listeners.delete(listener)
    }
  }

  return {
    blurTrigger,
    clickTrigger,
    focusTrigger,
    getContent: (value) => registry.getContent(value),
    getSnapshot,
    getTrigger: (value) => registry.getTrigger(value),
    getTriggers: () => registry.getTriggers(),
    handleTriggerKeydown,
    registerContent,
    registerTrigger,
    selectValue,
    setOptions,
    subscribe,
  }
}
