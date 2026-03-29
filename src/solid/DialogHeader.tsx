/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogHeaderProps = ComponentProps<'div'>

export function DialogHeader(props: DialogHeaderProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-dialog-header', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
