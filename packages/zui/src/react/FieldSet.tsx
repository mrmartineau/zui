import type { HTMLAttributes } from 'react'

export type FieldSetProps = HTMLAttributes<HTMLFieldSetElement> & {
  className?: string
}

export function FieldSet({ className, children, ...props }: FieldSetProps) {
  const classes = ['zui-field-set', className].filter(Boolean).join(' ')
  return (
    <fieldset className={classes} {...props}>
      {children}
    </fieldset>
  )
}
