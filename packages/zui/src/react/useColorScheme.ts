import { useEffect, useState } from 'react'
import {
  type ColorScheme,
  getColorScheme,
  setColorScheme,
} from '../utils/colorScheme'

export function useColorScheme() {
  const [scheme, setScheme] = useState<ColorScheme>(getColorScheme)

  useEffect(() => {
    function onchange(e: Event) {
      setScheme((e as CustomEvent<ColorScheme>).detail)
    }
    window.addEventListener('zui-color-scheme-change', onchange)
    return () => window.removeEventListener('zui-color-scheme-change', onchange)
  }, [])

  return { scheme, set: setColorScheme }
}
