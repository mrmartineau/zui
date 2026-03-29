import { createSignal, onMount, onCleanup } from 'solid-js'
import { getColorScheme, setColorScheme, type ColorScheme } from '../utils/colorScheme'

export function useColorScheme() {
  const [scheme, setScheme] = createSignal<ColorScheme>(getColorScheme())

  function onchange(e: Event) {
    setScheme((e as CustomEvent<ColorScheme>).detail)
  }

  onMount(() => {
    window.addEventListener('zui-color-scheme-change', onchange)
  })

  onCleanup(() => {
    window.removeEventListener('zui-color-scheme-change', onchange)
  })

  return { scheme, set: setColorScheme }
}
