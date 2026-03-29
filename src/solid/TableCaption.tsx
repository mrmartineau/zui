/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableCaptionProps = ComponentProps<'caption'>

export function TableCaption(props: TableCaptionProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-caption', local.class].filter(Boolean).join(' ')
  return <caption class={classes} {...rest} />
}
