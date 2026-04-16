import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { badgeVariants } from '../shared/badgeVariants'

type BadgeVariantProps = VariantProps<typeof badgeVariants>

export type BadgeProps = JSX.HTMLAttributes<HTMLSpanElement> &
  BadgeVariantProps & {
    class?: string
  }

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'color',
    'children',
  ])
  const classes = () =>
    badgeVariants({
      className: local.class,
      color: local.color,
      variant: local.variant,
    })
  return (
    <span class={classes()} {...rest}>
      {local.children}
    </span>
  )
}
