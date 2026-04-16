import type { AnchorHTMLAttributes } from 'react'

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

export function Link({ className, children, ...props }: LinkProps) {
  const classes = ['zui-link', className].filter(Boolean).join(' ')
  return (
    <a className={classes} {...props}>
      {children}
    </a>
  )
}
