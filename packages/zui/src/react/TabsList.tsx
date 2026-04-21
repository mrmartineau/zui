import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { tabsListVariants } from '../shared/tabsVariants'
import { useTabsSnapshot } from './tabsContext'

type TabsListVariantProps = VariantProps<typeof tabsListVariants>

export type TabsListProps = HTMLAttributes<HTMLDivElement> & TabsListVariantProps

export function TabsList({ children, className, variant, ...props }: TabsListProps) {
  const snapshot = useTabsSnapshot()
  const classes = tabsListVariants({ className, variant })

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
