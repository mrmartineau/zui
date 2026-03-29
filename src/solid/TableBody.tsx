/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableBodyProps = ComponentProps<'tbody'>

export function TableBody(props: TableBodyProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table-body', local.class].filter(Boolean).join(' ')
  return <tbody class={classes} {...rest} />
}
