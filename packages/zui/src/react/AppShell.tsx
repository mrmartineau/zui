import type { HTMLAttributes } from 'react'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  registerRoot: (el: HTMLDivElement | null) => void
  registerSidebar: (el: HTMLElement | null) => void
  toggle: () => void
  mode: AppShellMode
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

function useAppShellContext(component: string): AppShellContextValue {
  const ctx = useContext(AppShellContext)
  if (!ctx) {
    throw new Error(`${component} must be rendered inside <AppShell>`)
  }
  return ctx
}

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  position?: 'left' | 'right'
  defaultCollapsed?: boolean
  /** Controlled collapsed state. */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  mobileBreakpoint?: number
  /** localStorage key for persistence. Pass `null` to disable. */
  storageKey?: string | null
  /** Bind Cmd/Ctrl+B to toggle the sidebar. */
  shortcut?: boolean
}

export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  function AppShell(
    {
      position,
      className,
      defaultCollapsed = false,
      collapsed,
      onCollapsedChange,
      mobileBreakpoint = 768,
      storageKey,
      shortcut = false,
      children,
      id: providedId,
      ...rest
    },
    forwardedRef,
  ) {
    const generatedId = useId()
    const rootId = providedId ?? `zui-app-shell-${generatedId}`
    const sidebarId = `${rootId}-sidebar`
    const mainId = `${rootId}-main`

    const rootRef = useRef<HTMLDivElement | null>(null)
    const sidebarRef = useRef<HTMLElement | null>(null)
    const controllerRef = useRef<AppShellController | null>(null)
    const [mode, setMode] = useState<AppShellMode>('desktop')

    const classes = appShellVariants({ className, position })

    const registerRoot = useCallback(
      (el: HTMLDivElement | null) => {
        rootRef.current = el
        if (typeof forwardedRef === 'function') forwardedRef(el)
        else if (forwardedRef)
          (forwardedRef as React.RefObject<HTMLDivElement | null>).current = el
      },
      [forwardedRef],
    )

    const registerSidebar = useCallback((el: HTMLElement | null) => {
      sidebarRef.current = el
    }, [])

    useEffect(() => {
      if (!rootRef.current || !sidebarRef.current) return
      const controller = new AppShellController({
        root: rootRef.current,
        sidebar: sidebarRef.current,
        defaultCollapsed,
        collapsed,
        mobileBreakpoint,
        storageKey: storageKey === undefined ? undefined : storageKey,
        bindKeyboardShortcut: shortcut,
        onCollapsedChange,
      })
      controller.mount()
      const off = controller.onModeChange((m) => setMode(m))
      controllerRef.current = controller
      return () => {
        off()
        controller.destroy()
        controllerRef.current = null
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Sync controlled prop changes
    useEffect(() => {
      if (collapsed !== undefined) {
        controllerRef.current?.syncCollapsed(collapsed)
      }
    }, [collapsed])

    const toggle = useCallback(() => {
      controllerRef.current?.toggle()
    }, [])

    const ctx = useMemo<AppShellContextValue>(
      () => ({ rootId, sidebarId, mainId, registerRoot, registerSidebar, toggle, mode }),
      [rootId, sidebarId, mainId, registerRoot, registerSidebar, toggle, mode],
    )

    return (
      <AppShellContext.Provider value={ctx}>
        <div ref={registerRoot} id={rootId} className={classes} {...rest}>
          <a className="zui-app-shell-skip-link" href={`#${mainId}`}>
            Skip to main content
          </a>
          {children}
        </div>
      </AppShellContext.Provider>
    )
  },
)

export type AppShellHeaderProps = HTMLAttributes<HTMLElement> & {
  toggle?: boolean
  toggleLabel?: string
}

export function AppShellHeader({
  toggle = true,
  toggleLabel = 'Toggle sidebar',
  className,
  children,
  ...props
}: AppShellHeaderProps) {
  const ctx = useAppShellContext('AppShellHeader')
  const classes = appShellHeaderVariants({ className })
  return (
    <header className={classes} {...props}>
      {toggle && (
        <button
          type="button"
          className="zui-app-shell-toggle"
          aria-label={toggleLabel}
          aria-controls={ctx.sidebarId}
          onClick={ctx.toggle}
        >
          <i className="ph ph-list" aria-hidden="true" />
        </button>
      )}
      {children}
    </header>
  )
}

export type AppShellSidebarProps = HTMLAttributes<HTMLElement> & {
  label?: string
}

export function AppShellSidebar({
  label = 'Sidebar',
  className,
  children,
  ...props
}: AppShellSidebarProps) {
  const ctx = useAppShellContext('AppShellSidebar')
  const classes = appShellSidebarVariants({ className })
  return (
    <aside
      ref={ctx.registerSidebar}
      id={ctx.sidebarId}
      className={classes}
      aria-label={label}
      // @ts-expect-error popover is a valid HTML attribute, not yet in React types in all versions
      popover="auto"
      {...props}
    >
      {children}
    </aside>
  )
}

export type AppShellSidebarHeaderProps = HTMLAttributes<HTMLDivElement>
export function AppShellSidebarHeader({
  className,
  ...props
}: AppShellSidebarHeaderProps) {
  return (
    <div
      className={appShellSidebarHeaderVariants({ className })}
      {...props}
    />
  )
}

export type AppShellSidebarBodyProps = HTMLAttributes<HTMLDivElement>
export function AppShellSidebarBody({
  className,
  ...props
}: AppShellSidebarBodyProps) {
  return (
    <div className={appShellSidebarBodyVariants({ className })} {...props} />
  )
}

export type AppShellSidebarFooterProps = HTMLAttributes<HTMLDivElement>
export function AppShellSidebarFooter({
  className,
  ...props
}: AppShellSidebarFooterProps) {
  return (
    <div
      className={appShellSidebarFooterVariants({ className })}
      {...props}
    />
  )
}

export type AppShellMainProps = HTMLAttributes<HTMLElement>
export function AppShellMain({ className, id, ...props }: AppShellMainProps) {
  const ctx = useAppShellContext('AppShellMain')
  return (
    <main
      id={id ?? ctx.mainId}
      className={appShellMainVariants({ className })}
      {...props}
    />
  )
}
