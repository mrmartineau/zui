import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement>

export function DialogDescription(props: DialogDescriptionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-dialog-description', local.class].filter(Boolean).join(' ')
  return (
    <p class={classes()} {...rest}>
      {local.children}
    </p>
  )
}
