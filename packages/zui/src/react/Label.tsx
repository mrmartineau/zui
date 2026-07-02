import type { LabelHTMLAttributes } from 'react'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string
}

export function Label({ className, children, ...props }: LabelProps) {
  const classes = ['zui-label', className].filter(Boolean).join(' ')
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: consumers associate the control via htmlFor or by nesting their input inside
    <label className={classes} {...props}>
      {children}
    </label>
  )
}
