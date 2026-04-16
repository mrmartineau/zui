import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export function Input({ className, ...props }: InputProps) {
  const classes = ['zui-input', className].filter(Boolean).join(' ')
  return <input className={classes} {...props} />
}
