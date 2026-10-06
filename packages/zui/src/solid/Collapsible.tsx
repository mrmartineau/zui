import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { collapsibleVariants } from '../shared/collapsibleVariants'

type CollapsibleVariantProps = VariantProps<typeof collapsibleVariants>

export type CollapsibleProps = JSX.DetailsHtmlAttributes<HTMLDetailsElement> &
  CollapsibleVariantProps & {
    open?: boolean
  }

export function Collapsible(props: CollapsibleProps) {
  const [local, rest] = splitProps(props, ['class', 'shape'])
  const classes = () =>
    collapsibleVariants({ class: local.class, shape: local.shape })
  return <details class={classes()} {...rest} />
}
