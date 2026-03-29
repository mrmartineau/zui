/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableProps = ComponentProps<'table'>

export function Table(props: TableProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-table', local.class].filter(Boolean).join(' ')
  return <table class={classes} {...rest} />
}
