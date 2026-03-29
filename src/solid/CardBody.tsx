/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardBodyProps = ComponentProps<'div'>

export function CardBody(props: CardBodyProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-card-body', local.class].filter(Boolean).join(' ')
  return <div class={classes} {...rest} />
}
