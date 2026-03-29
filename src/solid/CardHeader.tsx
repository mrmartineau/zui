/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardHeaderProps = ComponentProps<'div'>

export function CardHeader(props: CardHeaderProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-card-header', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
