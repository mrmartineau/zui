import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { fieldVariants } from '../shared/fieldVariants'

type FieldVariantProps = VariantProps<typeof fieldVariants>

export type FieldProps = HTMLAttributes<HTMLDivElement> &
  FieldVariantProps & {
    className?: string
  }

export function Field({
  className,
  orientation,
  invalid,
  children,
  ...props
}: FieldProps) {
  const classes = fieldVariants({
    className,
    invalid,
    orientation,
  })
  return (
    <div className={classes} role="group" {...props}>
      {children}
    </div>
  )
}
