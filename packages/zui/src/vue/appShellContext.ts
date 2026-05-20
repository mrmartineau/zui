import { type InjectionKey, inject, provide } from 'vue'
import type {
  AppShellController,
  AppShellMode,
} from '../shared/AppShellController'

export type AppShellContext = {
  rootId: string
  sidebarId: string
  mainId: string
  setSidebar: (el: HTMLElement) => void
  getController: () => AppShellController | undefined
  toggle: () => void
  getMode: () => AppShellMode
}

const KEY: InjectionKey<AppShellContext> = Symbol('zui-app-shell')

export function provideAppShellContext(ctx: AppShellContext) {
  provide(KEY, ctx)
}

export function useAppShellContext(component: string): AppShellContext {
  const ctx = inject(KEY)
  if (!ctx) throw new Error(`${component} must be inside <AppShell>`)
  return ctx
}
