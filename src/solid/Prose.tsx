/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type ProseProps = ComponentProps<'div'>

export function Prose(props: ProseProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['prose', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
