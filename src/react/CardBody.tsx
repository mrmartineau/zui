import type { HTMLAttributes } from 'react'

export type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  const classes = ['zui-card-body', className].filter(Boolean).join(' ')
  return <div className={classes} {...props}>{children}</div>
}
