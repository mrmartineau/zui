import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type PopoverProps = JSX.HTMLAttributes<HTMLDivElement> & {
  id: string
  popover?: 'auto' | 'manual'
}

export function Popover(props: PopoverProps) {
  const [local, rest] = splitProps(props, [
    'id',
    'popover',
    'class',
    'style',
    'children',
  ])
  const classes = () => ['zui-popover', local.class].filter(Boolean).join(' ')
  const anchorStyle = (): JSX.CSSProperties => ({
    'position-anchor': `--${local.id}`,
    ...(typeof local.style === 'object' ? local.style : {}),
  })

  return (
    <div
      id={local.id}
      popover={local.popover ?? 'auto'}
      class={classes()}
      style={anchorStyle()}
      {...rest}
    >
      {local.children}
    </div>
  )
}
