/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps, Show } from 'solid-js'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuItemProps = ComponentProps<'button'> & ButtonVariantProps & {
  href?: string
}

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, ['class', 'href', 'variant', 'color', 'size', 'shape', 'icon'])
  const classes = () => buttonVariants({ variant: local.variant ?? 'ghost', color: local.color, size: local.size, shape: local.shape, icon: local.icon, class: ['zui-menu-item', local.class].filter(Boolean).join(' ') })

  return (
    <Show when={local.href} fallback={<button class={classes()} {...rest} />}>
      <a class={classes()} href={local.href} {...rest} />
    </Show>
  )
}
