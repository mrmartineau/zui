import type { HTMLAttributes } from 'react'

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>

export function CollapsibleContent({ className, ...props }: CollapsibleContentProps) {
  const classes = ['zui-collapsible-content', className].filter(Boolean).join(' ')
  return <div className={classes} {...props} />
}
