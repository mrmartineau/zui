import type { HTMLAttributes } from 'react'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  className?: string
}

export function Badge({ className, children, ...props }: BadgeProps) {
  const classes = ['zui-badge', className].filter(Boolean).join(' ')
  return <span className={classes} {...props}>{children}</span>
}
