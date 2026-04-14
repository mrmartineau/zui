import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type ButtonProps = ButtonVariantProps &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    class?: string
    href?: string
  }

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'variant',
    'color',
    'size',
    'shape',
    'icon',
    'href',
    'children',
  ])
  const classes = () =>
    buttonVariants({
      className: local.class,
      color: local.color,
      icon: local.icon,
      shape: local.shape,
      size: local.size,
      variant: local.variant,
    })

  return (
    <>
      {local.href ? (
        <a
          class={classes()}
          href={local.href}
          {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {local.children}
        </a>
      ) : (
        <button
          class={classes()}
          {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {local.children}
        </button>
      )}
    </>
  )
}
