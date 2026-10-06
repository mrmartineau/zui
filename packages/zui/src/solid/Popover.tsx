import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { popoverVariants } from '../shared/popoverVariants'

type PopoverVariantProps = VariantProps<typeof popoverVariants>

export type PopoverProps = JSX.HTMLAttributes<HTMLDivElement> &
  PopoverVariantProps & {
    id: string
    popover?: 'auto' | 'manual'
  }

export function Popover(props: PopoverProps) {
  const [local, rest] = splitProps(props, [
    'id',
    'popover',
    'class',
    'shape',
    'style',
    'children',
  ])
  const classes = () =>
    popoverVariants({ class: local.class, shape: local.shape })
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
