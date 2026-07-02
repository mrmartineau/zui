import { getContext, setContext } from 'svelte'
import type {
  AppShellController,
  AppShellMode,
} from '../shared/AppShellController'

const KEY = Symbol('zui-app-shell')

export type AppShellContext = {
  rootId: string
  sidebarId: string
  mainId: string
  setSidebar: (el: HTMLElement) => void
  getController: () => AppShellController | undefined
  toggle: () => void
  mode: () => AppShellMode
}

export function provideAppShellContext(ctx: AppShellContext) {
  setContext(KEY, ctx)
}

export function useAppShellContext(component: string): AppShellContext {
  const ctx = getContext<AppShellContext | undefined>(KEY)
  if (!ctx) throw new Error(`${component} must be inside <AppShell>`)
  return ctx
}
