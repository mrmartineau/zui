import type { HTMLAttributes } from 'react'

export type CardDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  const classes = ['zui-card-description', className].filter(Boolean).join(' ')
  return <div className={classes} {...props}>{children}</div>
}
