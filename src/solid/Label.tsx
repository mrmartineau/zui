/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type LabelProps = ComponentProps<'label'>

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-label', local.class].filter(Boolean).join(' ')
  return <label class={classes} {...rest} />
}
