/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = ComponentProps<'summary'> & ButtonVariantProps

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, ['class', 'variant', 'color', 'size', 'shape', 'icon'])
  const classes = buttonVariants({ variant: local.variant ?? 'outline', color: local.color, size: local.size, shape: local.shape, icon: local.icon, class: local.class })
  return <summary class={classes} {...rest} />
}
