import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { kbdVariants } from '../shared/kbdVariants'

type KbdVariantProps = VariantProps<typeof kbdVariants>

export type KbdProps = HTMLAttributes<HTMLElement> &
  KbdVariantProps & {
    className?: string
  }

export function Kbd({ className, shape, children, ...props }: KbdProps) {
  const classes = kbdVariants({ className, shape })
  return (
    <kbd className={classes} {...props}>
      {children}
    </kbd>
  )
}
