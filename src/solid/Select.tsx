/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type SelectProps = ComponentProps<'select'>

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-select', local.class].filter(Boolean).join(' ')
  return <select class={classes} {...rest} />
}
