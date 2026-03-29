/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardTitleProps = ComponentProps<'div'>

export function CardTitle(props: CardTitleProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-card-title', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
