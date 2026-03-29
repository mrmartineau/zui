/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogDescriptionProps = ComponentProps<'p'>

export function DialogDescription(props: DialogDescriptionProps) {
  const [local, rest] = splitProps(props, ['class'])
  const classes = ['zui-dialog-description', local.class].filter(Boolean).join(' ')
  return <p class={classes} {...rest} />
}
