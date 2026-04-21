import { describe, expect, it } from 'vitest'
import { getNextEnabledValue, getPreviousEnabledValue, getTabsKeyboardIntent } from './keyboard'

describe('tabs keyboard helpers', () => {
  it('maps horizontal LTR arrow keys correctly', () => {
    expect(getTabsKeyboardIntent('ArrowRight', { dir: 'ltr', orientation: 'horizontal' })).toBe('next')
    expect(getTabsKeyboardIntent('ArrowLeft', { dir: 'ltr', orientation: 'horizontal' })).toBe('previous')
  })

  it('maps horizontal RTL arrow keys correctly', () => {
    expect(getTabsKeyboardIntent('ArrowRight', { dir: 'rtl', orientation: 'horizontal' })).toBe('previous')
    expect(getTabsKeyboardIntent('ArrowLeft', { dir: 'rtl', orientation: 'horizontal' })).toBe('next')
  })

  it('maps vertical arrow keys correctly', () => {
    expect(getTabsKeyboardIntent('ArrowDown', { dir: 'ltr', orientation: 'vertical' })).toBe('next')
    expect(getTabsKeyboardIntent('ArrowUp', { dir: 'ltr', orientation: 'vertical' })).toBe('previous')
  })

  it('supports home, end, and select-focused keys', () => {
    expect(getTabsKeyboardIntent('Home', { dir: 'ltr', orientation: 'horizontal' })).toBe('first')
    expect(getTabsKeyboardIntent('End', { dir: 'ltr', orientation: 'horizontal' })).toBe('last')
    expect(getTabsKeyboardIntent('Enter', { dir: 'ltr', orientation: 'horizontal' })).toBe('select-focused')
    expect(getTabsKeyboardIntent(' ', { dir: 'ltr', orientation: 'horizontal' })).toBe('select-focused')
  })

  it('wraps enabled trigger navigation', () => {
    const triggers = [
      { value: 'account', disabled: false, element: null, order: 0, panelId: 'p1', triggerId: 't1' },
      { value: 'security', disabled: false, element: null, order: 1, panelId: 'p2', triggerId: 't2' },
      { value: 'billing', disabled: false, element: null, order: 2, panelId: 'p3', triggerId: 't3' },
    ]

    expect(getNextEnabledValue(triggers, 'billing')).toBe('account')
    expect(getPreviousEnabledValue(triggers, 'account')).toBe('billing')
  })
})
