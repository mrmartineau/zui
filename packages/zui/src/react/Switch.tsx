import type { InputHTMLAttributes } from 'react'

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role'
> & {
  className?: string
}

export function Switch({ className, children, ...props }: SwitchProps) {
  const classes = ['zui-switch', className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      {/* biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes checked state, so aria-checked is implicit */}
      <input type="checkbox" role="switch" {...props} />
      {children}
    </label>
  )
}
