import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type KbdGroupProps = JSX.HTMLAttributes<HTMLElement> & {
  class?: string
}

export function KbdGroup(props: KbdGroupProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-kbd-group', local.class].filter(Boolean).join(' ')
  return (
    <kbd class={classes()} {...rest}>
      {local.children}
    </kbd>
  )
}
