import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldSeparatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function FieldSeparator(props: FieldSeparatorProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-field-separator', local.class].filter(Boolean).join(' ')
  return (
    <div role="separator" class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
