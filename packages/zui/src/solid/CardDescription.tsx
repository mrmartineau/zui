import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardDescriptionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function CardDescription(props: CardDescriptionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-card-description', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
