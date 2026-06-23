import type { HTMLAttributes } from 'react'

export type FieldErrorProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
  const classes = ['zui-field-error', className].filter(Boolean).join(' ')
  return (
    <div className={classes} role="alert" {...props}>
      {children}
    </div>
  )
}
