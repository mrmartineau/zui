import type { VariantProps } from 'cva'
import type { ButtonHTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsTriggerVariants } from '../shared/tabsVariants'
import {
  getTabsTriggerOrder,
  useTabsContext,
  useTabsSnapshot,
} from './tabsContext'

type TabsTriggerVariantProps = VariantProps<typeof tabsTriggerVariants>

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  TabsTriggerVariantProps & {
    value: string
  }

export function TabsTrigger({
  children,
  className,
  disabled = false,
  onBlur,
  onClick,
  onFocus,
  onKeyDown,
  value,
  variant,
  ...props
}: TabsTriggerProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { controller, rootRef } = useTabsContext()
  const snapshot = useTabsSnapshot()
  const isActive = snapshot.selectedValue === value
  const rootId = snapshot.rootId
  const triggerId = createTabsTriggerId(rootId, value)
  const panelId = createTabsContentId(rootId, value)
  const classes = tabsTriggerVariants({ className, variant })

  useEffect(() => {
    return controller.registerTrigger({
      disabled,
      element: ref.current,
      order: getTabsTriggerOrder(rootRef.current, ref.current),
      panelId,
      triggerId,
      value,
    })
  }, [controller, disabled, panelId, rootRef, triggerId, value])

  return (
    <button
      {...props}
      ref={ref}
      aria-controls={panelId}
      aria-selected={isActive}
      className={classes}
      data-disabled={disabled ? 'true' : undefined}
      data-orientation={snapshot.orientation}
      data-state={isActive ? 'active' : 'inactive'}
      data-value={value}
      data-zui-tabs-trigger=""
      disabled={disabled || snapshot.disabled}
      id={triggerId}
      onBlur={(event) => {
        onBlur?.(event)
        if (!event.defaultPrevented) controller.blurTrigger(value)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) controller.clickTrigger(value)
      }}
      onFocus={(event) => {
        onFocus?.(event)
        if (!event.defaultPrevented) controller.focusTrigger(value)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented) {
          controller.handleTriggerKeydown(event.nativeEvent, value)
        }
      }}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      type="button"
    >
      {children}
    </button>
  )
}
