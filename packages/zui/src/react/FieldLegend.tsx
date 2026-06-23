import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { fieldLegendVariants } from '../shared/fieldLegendVariants'

type FieldLegendVariantProps = VariantProps<typeof fieldLegendVariants>

export type FieldLegendProps = HTMLAttributes<HTMLLegendElement> &
  FieldLegendVariantProps & {
    className?: string
  }

export function FieldLegend({
  className,
  variant,
  children,
  ...props
}: FieldLegendProps) {
  const classes = fieldLegendVariants({
    className,
    variant,
  })
  return (
    <legend className={classes} {...props}>
      {children}
    </legend>
  )
}
