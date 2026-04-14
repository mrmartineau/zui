import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = HTMLAttributes<HTMLElement> & ButtonVariantProps

export function MenuTrigger({
  className,
  variant = 'outline',
  color,
  size,
  shape,
  icon,
  ...props
}: MenuTriggerProps) {
  const classes = buttonVariants({
    className,
    color,
    icon,
    shape,
    size,
    variant,
  })
  return <summary className={classes} {...props} />
}
