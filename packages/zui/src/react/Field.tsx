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
    // biome-ignore lint/a11y/useSemanticElements: fieldset carries default styling and layout quirks; a div with role="group" is the deliberate choice here
    <div className={classes} role="group" {...props}>
      {children}
    </div>
  )
}
