import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { kbdVariants } from '../shared/kbdVariants'

type KbdVariantProps = VariantProps<typeof kbdVariants>

export type KbdProps = JSX.HTMLAttributes<HTMLElement> &
  KbdVariantProps & {
    class?: string
  }

export function Kbd(props: KbdProps) {
  const [local, rest] = splitProps(props, ['class', 'shape', 'children'])
  const classes = () => kbdVariants({ class: local.class, shape: local.shape })
  return (
    <kbd class={classes()} {...rest}>
      {local.children}
    </kbd>
  )
}
