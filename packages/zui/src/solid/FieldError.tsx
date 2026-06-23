import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldErrorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  class?: string
}

export function FieldError(props: FieldErrorProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-field-error', local.class].filter(Boolean).join(' ')
  return (
    <div role="alert" class={classes()} {...rest}>
      {local.children}
    </div>
  )
}
