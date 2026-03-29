/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableFooterProps = ComponentProps<'tfoot'>

export function TableFooter(props: TableFooterProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-footer', local.class].filter(Boolean).join(' ')
  return <tfoot class={classes} {...rest} />
}
