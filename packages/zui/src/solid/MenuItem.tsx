import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type MenuItemProps = ButtonVariantProps &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    class?: string
    href?: string
  }

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'color',
    'size',
    'shape',
    'icon',
    'href',
  ])
  const classes = () =>
    buttonVariants({
      className: ['zui-menu-item', local.class].filter(Boolean).join(' '),
      color: local.color,
      icon: local.icon,
      shape: local.shape,
      size: local.size,
      variant: local.variant ?? 'ghost',
    })

  return (
    <>
      {local.href ? (
        <a
          class={classes()}
          href={local.href}
          {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      ) : (
        <button
          class={classes()}
          {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
        />
      )}
    </>
  )
}
