/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'cva'
import { badgeVariants } from '../shared/badgeVariants'

type BadgeVariantProps = VariantProps<typeof badgeVariants>

export type BadgeProps = ComponentProps<'span'> & BadgeVariantProps

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'color'])
  const classes = badgeVariants({ variant: local.variant, color: local.color, class: local.class })
  return <span class={classes} {...rest} />
}
