/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CollapsibleContentProps = ComponentProps<'div'>

export function CollapsibleContent(props: CollapsibleContentProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-collapsible-content', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
