import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardTitleProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function CardTitle(props: CardTitleProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-card-title', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
