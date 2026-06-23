import type { HTMLAttributes } from 'react'

export type KbdGroupProps = HTMLAttributes<HTMLElement> & {
  className?: string
}

export function KbdGroup({ className, children, ...props }: KbdGroupProps) {
  const classes = ['zui-kbd-group', className].filter(Boolean).join(' ')
  return (
    <kbd className={classes} {...props}>
      {children}
    </kbd>
  )
}
