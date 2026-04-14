import type { InputHTMLAttributes } from 'react'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  className?: string
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  const classes = ['zui-checkbox', className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      <input type="checkbox" {...props} />
      {children}
    </label>
  )
}
