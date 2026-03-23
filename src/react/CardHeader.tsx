import type { HTMLAttributes } from 'react'

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  const classes = ['zui-card-header', className].filter(Boolean).join(' ')
  return <div className={classes} {...props}>{children}</div>
}
