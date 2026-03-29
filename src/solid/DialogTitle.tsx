/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogTitleProps = ComponentProps<'h2'>

export function DialogTitle(props: DialogTitleProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-dialog-title', local.class].filter(Boolean).join(' ')
  return <h2 class={classes} {...rest} />
}
