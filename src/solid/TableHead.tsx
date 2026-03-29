/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableHeadProps = ComponentProps<'th'>

export function TableHead(props: TableHeadProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-head', local.class].filter(Boolean).join(' ')
  return <th class={classes} {...rest} />
}
