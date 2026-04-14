import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogHeaderProps = JSX.HTMLAttributes<HTMLDivElement>

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-dialog-header', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
