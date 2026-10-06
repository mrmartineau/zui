import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { collapsibleVariants } from '../shared/collapsibleVariants'

type CollapsibleVariantProps = VariantProps<typeof collapsibleVariants>

export type CollapsibleProps = HTMLAttributes<HTMLDetailsElement> &
  CollapsibleVariantProps & {
    open?: boolean
  }

export function Collapsible({ className, shape, ...props }: CollapsibleProps) {
  const classes = collapsibleVariants({ className, shape })
  return <details className={classes} {...props} />
}
