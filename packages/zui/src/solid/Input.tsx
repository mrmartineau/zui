import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  class?: string
}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = () => ['zui-input', local.class].filter(Boolean).join(' ')
  return <input class={classes()} {...rest} />
}
