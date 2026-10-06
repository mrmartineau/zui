import type { VariantProps } from 'cva'
import type { SelectHTMLAttributes } from 'react'
import { selectVariants } from '../shared/selectVariants'

type SelectVariantProps = VariantProps<typeof selectVariants>

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  SelectVariantProps & {
    className?: string
  }

export function Select({ className, shape, children, ...props }: SelectProps) {
  const classes = selectVariants({ className, shape })
  return (
    <select className={classes} {...props}>
      {children}
    </select>
  )
}
