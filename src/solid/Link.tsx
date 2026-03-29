/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type LinkProps = ComponentProps<'a'>

export function Link(props: LinkProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-link', local.class].filter(Boolean).join(' ')
  return <a class={classes} {...rest} />
}
