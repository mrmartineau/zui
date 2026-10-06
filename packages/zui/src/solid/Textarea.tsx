import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { textareaVariants } from '../shared/textareaVariants'

type TextareaVariantProps = VariantProps<typeof textareaVariants>

export type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> &
  TextareaVariantProps & {
    class?: string
  }

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, ['class', 'shape'])
  const classes = () =>
    textareaVariants({ class: local.class, shape: local.shape })
  return <textarea class={classes()} {...rest} />
}
