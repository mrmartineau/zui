import type { InputHTMLAttributes } from 'react'

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  className?: string
}

export function Radio({ className, children, ...props }: RadioProps) {
  const classes = ['zui-radio', className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      <input type="radio" {...props} />
      {children}
    </label>
  )
}
