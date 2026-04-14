import type { HTMLAttributes } from 'react'

export type CardTitleProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  const classes = ['zui-card-title', className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
