import { useEffect, useLayoutEffect } from 'react'

/**
 * useLayoutEffect warns during React SSR ("useLayoutEffect does nothing on
 * the server") — fall back to useEffect when there is no DOM.
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect
