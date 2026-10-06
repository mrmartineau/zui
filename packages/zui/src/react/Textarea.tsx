import type { VariantProps } from 'cva'
import type { TextareaHTMLAttributes } from 'react'
import { textareaVariants } from '../shared/textareaVariants'

type TextareaVariantProps = VariantProps<typeof textareaVariants>

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  TextareaVariantProps & {
    className?: string
  }

export function Textarea({ className, shape, ...props }: TextareaProps) {
  const classes = textareaVariants({ className, shape })
  return <textarea className={classes} {...props} />
}
