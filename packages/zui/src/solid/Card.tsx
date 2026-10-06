import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cardVariants } from '../shared/cardVariants'

type CardVariantProps = VariantProps<typeof cardVariants>

export type CardProps = JSX.HTMLAttributes<HTMLDivElement> &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> &
  CardVariantProps & {
    class?: string
    href?: string
  }

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'href',
    'shape',
    'children',
  ])
  const classes = () =>
    cardVariants({
      class: [local.href && 'zui-card-interactive', local.class]
        .filter(Boolean)
        .join(' '),
      shape: local.shape,
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
        <div
          class={classes()}
          {...(rest as JSX.HTMLAttributes<HTMLDivElement>)}
        >
          {local.children}
        </div>
      )}
    </>
  )
}
