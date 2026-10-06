import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { inputVariants } from '../shared/inputVariants'

type InputVariantProps = VariantProps<typeof inputVariants>

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  InputVariantProps & {
    class?: string
  }

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ['class', 'shape'])
  const classes = () =>
    inputVariants({ class: local.class, shape: local.shape })
  return <input class={classes()} {...rest} />
}
