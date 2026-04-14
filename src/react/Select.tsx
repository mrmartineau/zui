import type { SelectHTMLAttributes } from 'react'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
}

export function Select({ className, children, ...props }: SelectProps) {
  const classes = ['zui-select', className].filter(Boolean).join(' ')
  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}
