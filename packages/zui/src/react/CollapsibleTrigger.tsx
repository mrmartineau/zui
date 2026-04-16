import type { HTMLAttributes } from 'react'

export type CollapsibleTriggerProps = HTMLAttributes<HTMLElement>

export function CollapsibleTrigger({
  className,
  ...props
}: CollapsibleTriggerProps) {
  const classes = ['zui-collapsible-trigger', className]
    .filter(Boolean)
    .join(' ')
  return <summary className={classes} {...props} />
}
