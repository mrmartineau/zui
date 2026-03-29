/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type PreProps = ComponentProps<'pre'>

export function Pre(props: PreProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-pre', local.class].filter(Boolean).join(' ')
  return <pre class={classes} {...rest} />
}
