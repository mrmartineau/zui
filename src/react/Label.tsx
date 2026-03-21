import type { LabelHTMLAttributes } from 'react'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string
}

export function Label({ className, children, ...props }: LabelProps) {
  const classes = ['zui-label', className].filter(Boolean).join(' ')
  return <label className={classes} {...props}>{children}</label>
}
