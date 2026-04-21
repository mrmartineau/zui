import type { JSX } from 'solid-js'
import { createMemo, splitProps } from 'solid-js'
import { tabsListVariants } from '../shared/tabsVariants'
import { useTabsContext } from './tabsContext'

export type TabsListProps = JSX.HTMLAttributes<HTMLDivElement>

export function TabsList(props: TabsListProps) {
  const [local, rest] = splitProps(props, ['children', 'class'])
  const { snapshot } = useTabsContext()
  const classes = createMemo(() => tabsListVariants({ className: local.class }))

  return (
    <div
      {...rest}
      class={classes()}
      data-orientation={snapshot().orientation}
      data-zui-tabs-list=""
      role="tablist"
      aria-orientation={
        snapshot().orientation === 'vertical' ? 'vertical' : undefined
      }
    >
      {local.children}
    </div>
  )
}
