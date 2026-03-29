/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableHeaderProps = ComponentProps<'thead'>

export function TableHeader(props: TableHeaderProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-header', local.class].filter(Boolean).join(' ')
  return <thead class={classes} {...rest} />
}
