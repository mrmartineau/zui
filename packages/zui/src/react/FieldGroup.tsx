import type { HTMLAttributes } from 'react'

export type FieldGroupProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function FieldGroup({ className, children, ...props }: FieldGroupProps) {
  const classes = ['zui-field-group', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
