import { onMounted, onUnmounted, ref } from 'vue'
import {
  type ColorScheme,
  getColorScheme,
  setColorScheme,
} from '../utils/colorScheme'

export function useColorScheme() {
  const scheme = ref<ColorScheme>(getColorScheme())

  function onchange(e: Event) {
    scheme.value = (e as CustomEvent<ColorScheme>).detail
  }

  onMounted(() => {
    window.addEventListener('zui-color-scheme-change', onchange)
  })

  onUnmounted(() => {
    window.removeEventListener('zui-color-scheme-change', onchange)
  })

  return { scheme, set: setColorScheme }
}
