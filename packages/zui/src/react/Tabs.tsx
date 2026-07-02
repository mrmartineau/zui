import type { HTMLAttributes } from 'react'
import { useId, useMemo, useRef, useSyncExternalStore } from 'react'
import {
  createTabsController,
  type TabsActivationMode,
  type TabsDirection,
  type TabsOrientation,
} from '../core/tabs'
import { tabsVariants } from '../shared/tabsVariants'
import { TabsContext } from './tabsContext'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  activationMode?: TabsActivationMode
  defaultValue?: string
  dir?: TabsDirection
  disabled?: boolean
  id?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
  value?: string
}

export function Tabs({
  activationMode = 'auto',
  children,
  className,
  defaultValue,
  dir = 'ltr',
  disabled = false,
  id,
  onValueChange,
  orientation = 'horizontal',
  value,
  ...props
}: TabsProps) {
  const reactId = useId()
  const rootId = id ?? `zui-tabs-${reactId.replace(/:/g, '')}`
  const rootRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<ReturnType<typeof createTabsController> | null>(
    null,
  )

  if (!controllerRef.current) {
    controllerRef.current = createTabsController({
      activationMode,
      defaultValue,
      dir,
      disabled,
      id: rootId,
      onValueChange,
      orientation,
      value,
    })
  }

  const controller = controllerRef.current

  useIsomorphicLayoutEffect(() => {
    controller.setOptions({
      activationMode,
      defaultValue,
      dir,
      disabled,
      id: rootId,
      onValueChange,
      orientation,
      value,
    })
  }, [
    activationMode,
    controller,
    defaultValue,
    dir,
    disabled,
    onValueChange,
    orientation,
    rootId,
    value,
  ])

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
  const classes = tabsVariants({ className })

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...props}
        ref={rootRef}
        className={classes}
        data-disabled={snapshot.disabled ? 'true' : undefined}
        data-orientation={snapshot.orientation}
        data-zui-tabs-root=""
        id={snapshot.rootId}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}
