/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps, Show } from 'solid-js'

export type CardProps = ComponentProps<'div'> & {
  href?: string
}

export function Card(props: CardProps) {
  const [local, rest] = splitProps(props, ['class', 'href'])
  const classes = () => ['zui-card', local.href && 'zui-card-interactive', local.class].filter(Boolean).join(' ')

  return (
    <Show when={local.href} fallback={<div class={classes()} {...rest} />}>
      <a class={classes()} href={local.href} {...rest} />
    </Show>
  )
}
