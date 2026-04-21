import type { HTMLAttributes } from 'react'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
import { createMenuController, type MenuAlign, type MenuDirection, type MenuSide } from '../core/menu'
import { MenuContext } from './menuContext'

export type MenuProps = HTMLAttributes<HTMLDivElement> & {
  align?: MenuAlign
  defaultOpen?: boolean
  dir?: MenuDirection
  disabled?: boolean
  id?: string
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
  side?: MenuSide
}

export function Menu({
  align = 'start',
  children,
  className,
  defaultOpen,
  dir = 'ltr',
  disabled = false,
  id,
  modal = false,
  onOpenChange,
  open,
  side = 'bottom',
  ...props
}: MenuProps) {
  const reactId = useId()
  const rootId = id ?? `zui-menu-${reactId.replace(/:/g, '')}`
  const rootRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<ReturnType<typeof createMenuController> | null>(null)

  if (!controllerRef.current) {
    controllerRef.current = createMenuController({
      align,
      defaultOpen,
      dir,
      disabled,
      id: rootId,
      modal,
      onOpenChange,
      open,
      side,
    })
  }

  const controller = controllerRef.current

  useLayoutEffect(() => {
    controller.setOptions({
      align,
      defaultOpen,
      dir,
      disabled,
      id: rootId,
      modal,
      onOpenChange,
      open,
      side,
    })
  }, [align, controller, defaultOpen, dir, disabled, modal, onOpenChange, open, rootId, side])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      controller.handleDocumentPointerDown(event.target)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [controller])

  const contextValue = useMemo(
    () => ({
      controller,
      rootRef,
    }),
    [controller],
  )

  const snapshot = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
    controller.getSnapshot,
  )

  return (
    <MenuContext.Provider value={contextValue}>
      <div
        {...props}
        ref={rootRef}
        className={['zui-menu', className].filter(Boolean).join(' ')}
        data-align={snapshot.align}
        data-disabled={snapshot.disabled ? 'true' : undefined}
        data-side={snapshot.side}
        data-state={snapshot.open ? 'open' : 'closed'}
        data-zui-menu-root=""
        id={snapshot.rootId}
      >
        {children}
      </div>
    </MenuContext.Provider>
  )
}
