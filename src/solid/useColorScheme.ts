import { createSignal, onCleanup } from 'solid-js'
import {
  type ColorScheme,
  getColorScheme,
  setColorScheme,
} from '../utils/colorScheme'

export function useColorScheme() {
  const [scheme, setScheme] = createSignal<ColorScheme>(getColorScheme())

  function onchange(e: Event) {
    setScheme((e as CustomEvent<ColorScheme>).detail)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('zui-color-scheme-change', onchange)
    onCleanup(() =>
      window.removeEventListener('zui-color-scheme-change', onchange),
    )
  }

  return { scheme, set: setColorScheme }
}
