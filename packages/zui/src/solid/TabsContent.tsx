import type { JSX } from 'solid-js'
import { createEffect, createMemo, onCleanup, splitProps } from 'solid-js'
import { createTabsContentId, createTabsTriggerId } from '../core/tabs'
import { tabsContentVariants } from '../shared/tabsVariants'
import { useTabsContext } from './tabsContext'

export type TabsContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value: string
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(props, ['children', 'class', 'hidden', 'value'])
  const { controller, snapshot } = useTabsContext()
  let ref: HTMLDivElement | undefined

  const classes = createMemo(() => tabsContentVariants({ className: local.class }))
  const isActive = createMemo(() => snapshot().selectedValue === local.value)
  const triggerId = createMemo(() => createTabsTriggerId(snapshot().rootId, local.value))
  const panelId = createMemo(() => createTabsContentId(snapshot().rootId, local.value))

  createEffect(() => {
    const unregister = controller.registerContent({
      element: ref ?? null,
      panelId: panelId(),
      triggerId: triggerId(),
      value: local.value,
    })

    onCleanup(unregister)
  })

  return (
    <div
      {...rest}
      ref={ref}
      aria-labelledby={triggerId()}
      class={classes()}
      data-orientation={snapshot().orientation}
      data-state={isActive() ? 'active' : 'inactive'}
      data-value={local.value}
      data-zui-tabs-content=""
      hidden={local.hidden ?? !isActive()}
      id={panelId()}
      role="tabpanel"
    >
      {local.children}
    </div>
  )
}
