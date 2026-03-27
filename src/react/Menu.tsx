import type { HTMLAttributes } from 'react'

export type MenuProps = HTMLAttributes<HTMLDetailsElement> & {
  open?: boolean
}

export function Menu({ className, ...props }: MenuProps) {
  const classes = ['zui-menu', className].filter(Boolean).join(' ')
  return <details className={classes} {...props} />
}
