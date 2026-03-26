import type { HTMLAttributes } from 'react'

export type CollapsibleProps = HTMLAttributes<HTMLDetailsElement> & {
  open?: boolean
}

export function Collapsible({ className, ...props }: CollapsibleProps) {
  const classes = ['zui-collapsible', className].filter(Boolean).join(' ')
  return <details className={classes} {...props} />
}
