/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { textSizeClass, type TextSize } from '../shared/textSizeClass'

export type TextProps = ComponentProps<'span'> & {
  size?: TextSize
}

export function Text(props: TextProps) {
  const [local, rest] = splitProps(props, ['class', 'size'])
  const classes = [textSizeClass(local.size ?? '0'), local.class].filter(Boolean).join(' ')
  return <span class={classes} {...rest} />
}
