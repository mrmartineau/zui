import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = HTMLAttributes<HTMLElement> & ButtonVariantProps

export function MenuTrigger({ className, variant = 'outline', color, size, shape, icon, ...props }: MenuTriggerProps) {
  const classes = buttonVariants({ variant, color, size, shape, icon, className })
  return <summary className={classes} {...props} />
}
