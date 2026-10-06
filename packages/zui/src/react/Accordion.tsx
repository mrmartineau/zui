import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { accordionVariants } from '../shared/accordionVariants'

type AccordionVariantProps = VariantProps<typeof accordionVariants>

export type AccordionProps = HTMLAttributes<HTMLDivElement> &
  AccordionVariantProps

export function Accordion({
  className,
  flush,
  shape,
  ...props
}: AccordionProps) {
  const classes = accordionVariants({ className, flush, shape })
  return <div className={classes} {...props} />
}
