import {
  getColorScheme,
  setColorScheme,
  type ColorScheme,
} from '../utils/colorScheme'

export function useColorScheme() {
  let scheme = $state<ColorScheme>(getColorScheme())

  function onchange(e: Event) {
    scheme = (e as CustomEvent<ColorScheme>).detail
  }

  $effect(() => {
    window.addEventListener('zui-color-scheme-change', onchange)
    return () => {
      window.removeEventListener('zui-color-scheme-change', onchange)
    }
  })

  return {
    get scheme() {
      return scheme
    },
    set: setColorScheme,
  }
}
