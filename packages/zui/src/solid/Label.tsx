import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & {
  class?: string
}

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-label', local.class].filter(Boolean).join(' ')
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: consumers associate the control via for/htmlFor or by nesting their input inside
    <label class={classes()} {...rest}>
      {local.children}
    </label>
  )
}
