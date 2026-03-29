/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CodeProps = ComponentProps<'code'>

export function Code(props: CodeProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-code', local.class].filter(Boolean).join(' ')
  return <code class={classes} {...rest} />
}
