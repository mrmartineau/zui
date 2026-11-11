import { forwardRef, type InputHTMLAttributes } from 'react'

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'role'
> & {
  className?: string
}

/** The `ref` goes to the `<input>`, so form libraries and focus code can reach it. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, children, ...props },
  ref,
) {
  const classes = ['zui-switch', className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      {/* biome-ignore lint/a11y/useAriaPropsForRole: a native checkbox exposes checked state, so aria-checked is implicit */}
      <input ref={ref} type="checkbox" role="switch" {...props} />
      {children}
    </label>
  )
})
