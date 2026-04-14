import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardBodyProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function CardBody(props: CardBodyProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-card-body', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
