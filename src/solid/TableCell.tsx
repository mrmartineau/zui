/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableCellProps = ComponentProps<'td'>

export function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-cell', local.class].filter(Boolean).join(' ')
  return <td class={classes} {...rest} />
}
