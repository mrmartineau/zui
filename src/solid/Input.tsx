/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type InputProps = ComponentProps<'input'>

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-input', local.class].filter(Boolean).join(' ')
  return <input class={classes} {...rest} />
}
