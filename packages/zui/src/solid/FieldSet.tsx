import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type FieldSetProps = JSX.HTMLAttributes<HTMLFieldSetElement> & {
  class?: string
}

export function FieldSet(props: FieldSetProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-field-set', local.class].filter(Boolean).join(' ')
  return (
    <fieldset class={classes()} {...rest}>
      {local.children}
    </fieldset>
  )
}
