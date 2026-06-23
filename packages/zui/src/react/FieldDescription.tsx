import type { HTMLAttributes } from 'react'

export type FieldDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function FieldDescription({
  className,
  children,
  ...props
}: FieldDescriptionProps) {
  const classes = ['zui-field-description', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
