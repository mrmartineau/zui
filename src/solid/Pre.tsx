import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type PreProps = JSX.HTMLAttributes<HTMLPreElement> & {
  class?: string
}

export function Pre(props: PreProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-pre', local.class].filter(Boolean).join(' ')
  return (
    <pre class={classes()} {...rest}>
      {local.children}
    </pre>
  )
}
