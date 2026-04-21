import type { HTMLAttributes } from 'react'
import { tabsListVariants } from '../shared/tabsVariants'
import { useTabsSnapshot } from './tabsContext'

export type TabsListProps = HTMLAttributes<HTMLDivElement>

export function TabsList({ children, className, ...props }: TabsListProps) {
  const snapshot = useTabsSnapshot()
  const classes = tabsListVariants({ className })

  return (
    <div
      {...props}
      className={classes}
      data-orientation={snapshot.orientation}
      data-zui-tabs-list=""
      role="tablist"
      aria-orientation={
        snapshot.orientation === 'vertical' ? 'vertical' : undefined
      }
    >
      {children}
    </div>
  )
}
