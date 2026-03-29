/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableRowProps = ComponentProps<'tr'>

export function TableRow(props: TableRowProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-row', local.class].filter(Boolean).join(' ')
  return <tr class={classes} {...rest} />
}
