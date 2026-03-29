/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardDescriptionProps = ComponentProps<'div'>

export function CardDescription(props: CardDescriptionProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-card-description', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
