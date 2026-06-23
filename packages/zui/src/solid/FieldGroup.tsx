import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function FieldGroup(props: FieldGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-field-group', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
