import type { VariantProps } from 'cva'
import type { InputHTMLAttributes } from 'react'
import { inputVariants } from '../shared/inputVariants'

type InputVariantProps = VariantProps<typeof inputVariants>

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  InputVariantProps & {
    className?: string
  }

export function Input({ className, shape, ...props }: InputProps) {
  const classes = inputVariants({ className, shape })
  return <input className={classes} {...props} />
}
