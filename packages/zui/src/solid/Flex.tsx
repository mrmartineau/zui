import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { flexVariants } from '../shared/flexVariants'

type FlexVariantProps = VariantProps<typeof flexVariants>

export type FlexProps = JSX.HTMLAttributes<HTMLDivElement> &
  FlexVariantProps & {
    class?: string
  }

export function Flex(props: FlexProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'display',
    'direction',
    'align',
    'justify',
    'wrap',
    'gap',
    'gapX',
    'gapY',
    'children',
  ])
  const classes = () =>
    flexVariants({
      align: local.align,
      className: local.class,
      direction: local.direction,
      display: local.display,
      gap: local.gap,
      gapX: local.gapX,
      gapY: local.gapY,
      justify: local.justify,
      wrap: local.wrap,
    })
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
