import type { HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsContentVariants } from '../shared/tabsVariants'
import { useTabsContext, useTabsSnapshot } from './tabsContext'

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
}

export function TabsContent({
  children,
  className,
  hidden,
  value,
  ...props
}: TabsContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { controller } = useTabsContext()
  const snapshot = useTabsSnapshot()
  const isActive = snapshot.selectedValue === value
  const rootId = snapshot.rootId
  const triggerId = createTabsTriggerId(rootId, value)
  const panelId = createTabsContentId(rootId, value)
  const classes = tabsContentVariants({ className })

  useEffect(() => {
    return controller.registerContent({
      element: ref.current,
      panelId,
      triggerId,
      value,
    })
  }, [controller, panelId, triggerId, value])

  return (
    <div
      {...props}
      ref={ref}
      aria-labelledby={triggerId}
      className={classes}
      data-orientation={snapshot.orientation}
      data-state={isActive ? 'active' : 'inactive'}
      data-value={value}
      data-zui-tabs-content=""
      hidden={hidden ?? !isActive}
      id={panelId}
      role="tabpanel"
    >
      {children}
    </div>
  )
}
