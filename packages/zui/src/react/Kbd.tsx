import type { HTMLAttributes } from 'react'

export type KbdProps = HTMLAttributes<HTMLElement> & {
  className?: string
}

export function Kbd({ className, children, ...props }: KbdProps) {
  const classes = ['zui-kbd', className].filter(Boolean).join(' ')
  return (
    <kbd className={classes} {...props}>
      {children}
    </kbd>
  )
}
