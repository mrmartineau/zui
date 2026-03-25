export type ColorScheme = 'dark' | 'light' | 'system'

const STORAGE_KEY = 'zui-color-scheme'
const DARK_CLASS = 'zui-dark'
const LIGHT_CLASS = 'zui-light'
const EVENT = 'zui-color-scheme-change'
const CYCLE: ColorScheme[] = ['light', 'dark', 'system']

export function getColorScheme(): ColorScheme {
  if (typeof localStorage === 'undefined') return 'system'
  return (localStorage.getItem(STORAGE_KEY) as ColorScheme) ?? 'system'
}

export function setColorScheme(scheme: ColorScheme): void {
  const root = document.documentElement
  root.classList.remove(DARK_CLASS, LIGHT_CLASS)
  if (scheme === 'dark') root.classList.add(DARK_CLASS)
  else if (scheme === 'light') root.classList.add(LIGHT_CLASS)
  localStorage.setItem(STORAGE_KEY, scheme)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: scheme }))
}

/**
 * Returns the next colour scheme in the cycle: light → dark → system → light…
 */
export function nextColorScheme(current?: ColorScheme): ColorScheme {
  const scheme = current ?? getColorScheme()
  const idx = CYCLE.indexOf(scheme)
  return CYCLE[(idx + 1) % CYCLE.length]
}

export function initColorScheme(): void {
  if (typeof localStorage === 'undefined') return
  const scheme = getColorScheme()
  if (scheme === 'system') return
  const root = document.documentElement
  root.classList.remove(DARK_CLASS, LIGHT_CLASS)
  if (scheme === 'dark') root.classList.add(DARK_CLASS)
  else if (scheme === 'light') root.classList.add(LIGHT_CLASS)
}

/**
 * Paste this into your <head> before any stylesheets to prevent
 * a flash of the wrong color scheme on page load.
 *
 * @example
 * import { headScript } from '@mrmartineau/zui/utils'
 * // In your HTML <head>:
 * // <script>{headScript}</script>
 */
export const headScript = `(function(){var s=localStorage.getItem('zui-color-scheme');if(s==='dark')document.documentElement.classList.add('zui-dark');else if(s==='light')document.documentElement.classList.add('zui-light');})()`
