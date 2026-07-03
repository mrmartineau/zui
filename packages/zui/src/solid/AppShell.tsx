import {
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  type JSX,
  onCleanup,
  onMount,
  splitProps,
  useContext,
} from 'solid-js'
import {
  AppShellController,
  type AppShellMode,
} from '../shared/AppShellController'
import {
  appShellHeaderVariants,
  appShellMainVariants,
  appShellSidebarBodyVariants,
  appShellSidebarFooterVariants,
  appShellSidebarHeaderVariants,
  appShellSidebarVariants,
  appShellVariants,
} from '../shared/appShellVariants'

type AppShellContextValue = {
  rootId: string
  sidebarId: string
  mainId: string
  setSidebar: (el: HTMLElement) => void
  toggle: () => void
  mode: () => AppShellMode
}

const AppShellContext = createContext<AppShellContextValue>()

function useShell(component: string): AppShellContextValue {
  const ctx = useContext(AppShellContext)
  if (!ctx) throw new Error(`${component} must be inside <AppShell>`)
  return ctx
}

export type AppShellProps = JSX.HTMLAttributes<HTMLDivElement> & {
  position?: 'left' | 'right'
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  mobileBreakpoint?: number
  storageKey?: string | null
  shortcut?: boolean
  class?: string
}

export function AppShell(props: AppShellProps) {
  const [local, rest] = splitProps(props, [
    'position',
    'class',
    'defaultCollapsed',
    'collapsed',
    'onCollapsedChange',
    'mobileBreakpoint',
    'storageKey',
    'shortcut',
    'children',
    'id',
  ])

  const uid = createUniqueId()
  const rootId = local.id ?? `zui-app-shell-${uid}`
  const sidebarId = `${rootId}-sidebar`
  const mainId = `${rootId}-main`

  let rootEl!: HTMLDivElement
  let sidebarEl: HTMLElement | undefined
  let controller: AppShellController | undefined
  const [mode, setMode] = createSignal<AppShellMode>('desktop')

  const setSidebar = (el: HTMLElement) => {
    sidebarEl = el
  }

  onMount(() => {
    if (!sidebarEl) return
    controller = new AppShellController({
      bindKeyboardShortcut: local.shortcut ?? false,
      collapsed: local.collapsed,
      defaultCollapsed: local.defaultCollapsed ?? false,
      mobileBreakpoint: local.mobileBreakpoint ?? 768,
      onCollapsedChange: local.onCollapsedChange,
      root: rootEl,
      sidebar: sidebarEl,
      storageKey: local.storageKey === undefined ? undefined : local.storageKey,
    })
    controller.mount()
    const off = controller.onModeChange((m) => setMode(m))
    onCleanup(() => {
      off()
      controller?.destroy()
    })
  })

  createEffect(() => {
    if (local.collapsed !== undefined && controller) {
      controller.syncCollapsed(local.collapsed)
    }
  })

  const toggle = () => controller?.toggle()

  const ctx: AppShellContextValue = {
    mainId,
    mode,
    rootId,
    setSidebar,
    sidebarId,
    toggle,
  }

  return (
    <AppShellContext.Provider value={ctx}>
      <div
        ref={(el) => {
          rootEl = el
        }}
        id={rootId}
        class={appShellVariants({
          class: local.class,
          position: local.position,
        })}
        {...rest}
      >
        <a class="zui-app-shell-skip-link" href={`#${mainId}`}>
          Skip to main content
        </a>
        {local.children}
      </div>
    </AppShellContext.Provider>
  )
}

export type AppShellHeaderProps = JSX.HTMLAttributes<HTMLElement> & {
  toggle?: boolean
  toggleLabel?: string
  class?: string
}

export function AppShellHeader(props: AppShellHeaderProps) {
  const ctx = useShell('AppShellHeader')
  const [local, rest] = splitProps(props, [
    'toggle',
    'toggleLabel',
    'class',
    'children',
  ])
  const showToggle = () => local.toggle !== false
  return (
    <header class={appShellHeaderVariants({ class: local.class })} {...rest}>
      {showToggle() && (
        <button
          type="button"
          class="zui-app-shell-toggle"
          aria-label={local.toggleLabel ?? 'Toggle sidebar'}
          aria-controls={ctx.sidebarId}
          onClick={ctx.toggle}
        >
          <i class="ph ph-list" aria-hidden="true" />
        </button>
      )}
      {local.children}
    </header>
  )
}

export type AppShellSidebarProps = JSX.HTMLAttributes<HTMLElement> & {
  label?: string
  class?: string
}

export function AppShellSidebar(props: AppShellSidebarProps) {
  const ctx = useShell('AppShellSidebar')
  const [local, rest] = splitProps(props, ['label', 'class', 'children'])
  return (
    <aside
      ref={(el) => ctx.setSidebar(el)}
      id={ctx.sidebarId}
      class={appShellSidebarVariants({ class: local.class })}
      aria-label={local.label ?? 'Sidebar'}
      // @ts-expect-error popover attribute
      popover="auto"
      {...rest}
    >
      {local.children}
    </aside>
  )
}

export function AppShellSidebarHeader(
  props: JSX.HTMLAttributes<HTMLDivElement> & { class?: string },
) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div
      class={appShellSidebarHeaderVariants({ class: local.class })}
      {...rest}
    >
      {local.children}
    </div>
  )
}

export function AppShellSidebarBody(
  props: JSX.HTMLAttributes<HTMLDivElement> & { class?: string },
) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div class={appShellSidebarBodyVariants({ class: local.class })} {...rest}>
      {local.children}
    </div>
  )
}

export function AppShellSidebarFooter(
  props: JSX.HTMLAttributes<HTMLDivElement> & { class?: string },
) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <div
      class={appShellSidebarFooterVariants({ class: local.class })}
      {...rest}
    >
      {local.children}
    </div>
  )
}

export type AppShellMainProps = JSX.HTMLAttributes<HTMLElement> & {
  class?: string
}

export function AppShellMain(props: AppShellMainProps) {
  const ctx = useShell('AppShellMain')
  const [local, rest] = splitProps(props, ['class', 'children', 'id'])
  return (
    <main
      id={local.id ?? ctx.mainId}
      class={appShellMainVariants({ class: local.class })}
      {...rest}
    >
      {local.children}
    </main>
  )
}
