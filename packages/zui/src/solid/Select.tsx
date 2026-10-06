import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { selectVariants } from '../shared/selectVariants'

type SelectVariantProps = VariantProps<typeof selectVariants>

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> &
  SelectVariantProps & {
    class?: string
  }

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ['class', 'shape', 'children'])
  const classes = () =>
    selectVariants({ class: local.class, shape: local.shape })
  return (
    <select class={classes()} {...rest}>
      {local.children}
    </select>
  )
}
