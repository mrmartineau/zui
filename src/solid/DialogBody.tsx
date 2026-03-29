/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogBodyProps = ComponentProps<'div'>

export function DialogBody(props: DialogBodyProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-dialog-body', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
