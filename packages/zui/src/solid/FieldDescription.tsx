import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldDescriptionProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function FieldDescription(props: FieldDescriptionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-field-description', local.class].filter(Boolean).join(' ')
  return (
    <div class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
