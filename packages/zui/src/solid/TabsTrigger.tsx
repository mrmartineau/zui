import type { JSX } from 'solid-js'
import { createEffect, createMemo, onCleanup, splitProps } from 'solid-js'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsTriggerVariants } from '../shared/tabsVariants'
import { getTabsTriggerOrder, useTabsContext } from './tabsContext'

export type TabsTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

export function TabsTrigger(props: TabsTriggerProps) {
  const [local, rest] = splitProps(props, [
    'children',
    'class',
    'disabled',
    'onBlur',
    'onClick',
    'onFocus',
    'onKeyDown',
    'value',
  ])
  const { controller, rootRef, snapshot } = useTabsContext()
  let ref: HTMLButtonElement | undefined

  const classes = createMemo(() => tabsTriggerVariants({ className: local.class }))
  const isActive = createMemo(() => snapshot().selectedValue === local.value)
  const triggerId = createMemo(() => createTabsTriggerId(snapshot().rootId, local.value))
  const panelId = createMemo(() => createTabsContentId(snapshot().rootId, local.value))

  createEffect(() => {
    const unregister = controller.registerTrigger({
      disabled: !!local.disabled,
      element: ref ?? null,
      order: getTabsTriggerOrder(rootRef(), ref),
      panelId: panelId(),
      triggerId: triggerId(),
      value: local.value,
    })

    onCleanup(unregister)
  })

  return (
    <button
      {...rest}
      ref={ref}
      aria-controls={panelId()}
      aria-selected={isActive()}
      class={classes()}
      data-disabled={local.disabled ? 'true' : undefined}
      data-orientation={snapshot().orientation}
      data-state={isActive() ? 'active' : 'inactive'}
      data-value={local.value}
      data-zui-tabs-trigger=""
      disabled={local.disabled || snapshot().disabled}
      id={triggerId()}
      onBlur={(event) => {
        local.onBlur?.(event)
        if (!event.defaultPrevented) controller.blurTrigger(local.value)
      }}
      onClick={(event) => {
        local.onClick?.(event)
        if (!event.defaultPrevented) controller.clickTrigger(local.value)
      }}
      onFocus={(event) => {
        local.onFocus?.(event)
        if (!event.defaultPrevented) controller.focusTrigger(local.value)
      }}
      onKeyDown={(event) => {
        local.onKeyDown?.(event)
        if (!event.defaultPrevented) {
          controller.handleTriggerKeydown(event, local.value)
        }
      }}
      role="tab"
      tabIndex={isActive() ? 0 : -1}
      type="button"
    >
      {local.children}
    </button>
  )
}
