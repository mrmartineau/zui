import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuTriggerProps = JSX.HTMLAttributes<HTMLElement> &
  ButtonVariantProps

export function MenuTrigger(props: MenuTriggerProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'color',
    'size',
    'shape',
    'icon',
  ])
  const classes = () =>
    buttonVariants({
      className: local.class,
      color: local.color,
      icon: local.icon,
      shape: local.shape,
      size: local.size,
      variant: local.variant ?? 'outline',
    })
  return <summary class={classes()} {...rest} />
}
