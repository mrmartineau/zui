import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CodeProps = JSX.HTMLAttributes<HTMLElement> & {
  class?: string
}

export function Code(props: CodeProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-code', local.class].filter(Boolean).join(' ')
  return (
    <code class={classes()} {...rest}>
      {local.children}
    </code>
  )
}
