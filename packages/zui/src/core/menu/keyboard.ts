import type { MenuDirection } from './types'

export type MenuKeyboardIntent =
  | 'close'
  | 'first'
  | 'last'
  | 'next'
  | 'none'
  | 'previous'
  | 'select'
  | 'tab'

export function getTriggerKeyboardIntent(key: string) {
  if (key === 'Enter' || key === ' ') return 'open-first' as const
  if (key === 'ArrowDown') return 'open-first' as const
  if (key === 'ArrowUp') return 'open-last' as const
  return 'none' as const
}

export function getContentKeyboardIntent(key: string, dir: MenuDirection): MenuKeyboardIntent {
  if (key === 'Escape') return 'close'
  if (key === 'Tab') return 'tab'
  if (key === 'Home') return 'first'
  if (key === 'End') return 'last'
  if (key === 'ArrowDown') return 'next'
  if (key === 'ArrowUp') return 'previous'
  if (key === 'ArrowRight') return dir === 'rtl' ? 'previous' : 'next'
  if (key === 'ArrowLeft') return dir === 'rtl' ? 'next' : 'previous'
  if (key === 'Enter' || key === ' ') return 'select'
  return 'none'
}
