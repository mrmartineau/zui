/** @jsxImportSource solid-js */
import type { ComponentProps, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type PopoverProps = ComponentProps<'div'> & {
  id: string
  popover?: 'auto' | 'manual'
}

export function Popover(props: PopoverProps) {
  const [local, rest] = splitProps(props, ['id', 'popover', 'class', 'style'])
  const classes = ['zui-popover', local.class].filter(Boolean).join(' ')
  const anchorStyle: JSX.CSSProperties = {
    'position-anchor': `--${local.id}`,
    ...(local.style as JSX.CSSProperties),
  }

  return (
    <div id={local.id} popover={local.popover ?? 'auto'} class={classes} style={anchorStyle} {...rest} />
  )
}
