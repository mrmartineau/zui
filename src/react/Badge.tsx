import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { badgeVariants } from '../shared/badgeVariants'

type BadgeVariantProps = VariantProps<typeof badgeVariants>

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  BadgeVariantProps & {
    className?: string
  }

export function Badge({
  className,
  variant,
  color,
  children,
  ...props
}: BadgeProps) {
  const classes = badgeVariants({ className, color, variant })
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
