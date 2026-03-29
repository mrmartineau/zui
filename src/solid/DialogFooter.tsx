/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogFooterProps = ComponentProps<'div'>

export function DialogFooter(props: DialogFooterProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-dialog-footer', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
