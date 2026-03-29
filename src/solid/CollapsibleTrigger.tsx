/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CollapsibleTriggerProps = ComponentProps<'summary'>

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-collapsible-trigger', local.class].filter(Boolean).join(' ')
  return <summary class={classes} {...rest} />
}
