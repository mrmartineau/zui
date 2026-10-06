import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { accordionVariants } from '../shared/accordionVariants'

type AccordionVariantProps = VariantProps<typeof accordionVariants>

export type AccordionProps = JSX.HTMLAttributes<HTMLDivElement> &
  AccordionVariantProps

export function Accordion(props: AccordionProps) {
  const [local, rest] = splitProps(props, ['class', 'flush', 'shape'])
  const classes = () =>
    accordionVariants({
      class: local.class,
      flush: local.flush,
      shape: local.shape,
    })
  return <div class={classes()} {...rest} />
}
