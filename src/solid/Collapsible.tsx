/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CollapsibleProps = ComponentProps<'details'> & {
  open?: boolean
}

export function Collapsible(props: CollapsibleProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-collapsible', local.class].filter(Boolean).join(' ')
  return <details class={classes} {...rest} />
}
