import type {
  TabsDirection,
  TabsOrientation,
  TabsTriggerRegistration,
} from './types'

export interface TabsKeyboardConfig {
  dir: TabsDirection
  orientation: TabsOrientation
}

export type TabsKeyboardIntent =
  | 'first'
  | 'last'
  | 'next'
  | 'none'
  | 'previous'
  | 'select-focused'

export function getTabsKeyboardIntent(
  key: string,
  config: TabsKeyboardConfig,
): TabsKeyboardIntent {
  if (key === 'Home') return 'first'
  if (key === 'End') return 'last'
  if (key === 'Enter' || key === ' ') return 'select-focused'

  if (config.orientation === 'vertical') {
    if (key === 'ArrowDown') return 'next'
    if (key === 'ArrowUp') return 'previous'
    return 'none'
  }

  if (key === 'ArrowRight') {
    return config.dir === 'rtl' ? 'previous' : 'next'
  }

  if (key === 'ArrowLeft') {
    return config.dir === 'rtl' ? 'next' : 'previous'
  }

  return 'none'
}

export function getNextEnabledValue(
  triggers: TabsTriggerRegistration[],
  currentValue: string,
) {
  if (triggers.length === 0) return null
  const currentIndex = triggers.findIndex((trigger) => trigger.value === currentValue)
  if (currentIndex === -1) return triggers[0]?.value ?? null
  return triggers[(currentIndex + 1) % triggers.length]?.value ?? null
}

export function getPreviousEnabledValue(
  triggers: TabsTriggerRegistration[],
  currentValue: string,
) {
  if (triggers.length === 0) return null
  const currentIndex = triggers.findIndex((trigger) => trigger.value === currentValue)
  if (currentIndex === -1) return triggers[triggers.length - 1]?.value ?? null
  return triggers[(currentIndex - 1 + triggers.length) % triggers.length]?.value ?? null
}
