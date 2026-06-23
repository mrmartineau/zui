import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type KbdProps = JSX.HTMLAttributes<HTMLElement> & {
  class?: string
}

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-kbd', local.class].filter(Boolean).join(' ')
  return (
    <kbd class={classes()} {...rest}>
      {local.children}
    </kbd>
  )
}
