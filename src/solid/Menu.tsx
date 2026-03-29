/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type MenuProps = ComponentProps<'details'> & {
  open?: boolean
}

export function Menu(props: MenuProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-menu', local.class].filter(Boolean).join(' ')
  return <details class={classes} {...rest} />
}
