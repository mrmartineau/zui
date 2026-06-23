import type { HTMLAttributes } from 'react'

export type FieldSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function FieldSeparator({
  className,
  children,
  ...props
}: FieldSeparatorProps) {
  const classes = ['zui-field-separator', className].filter(Boolean).join(' ')
  return (
    <div className={classes} role="separator" {...props}>
      {children}
    </div>
  )
}
