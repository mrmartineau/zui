import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogTitleProps = JSX.HTMLAttributes<HTMLHeadingElement>

export function DialogTitle(props: DialogTitleProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-dialog-title', local.class].filter(Boolean).join(' ')
  return (
    <h2 class={classes()} {...rest}>
      {local.children}
    </h2>
  )
}
