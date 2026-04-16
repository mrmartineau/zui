import type { TextareaHTMLAttributes } from 'react'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string
}

export function Textarea({ className, ...props }: TextareaProps) {
  const classes = ['zui-textarea', className].filter(Boolean).join(' ')
  return <textarea className={classes} {...props} />
}
