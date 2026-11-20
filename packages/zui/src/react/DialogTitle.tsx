import type { HTMLAttributes } from 'react'

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>

export function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <h2 className={['zui-dialog-title', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </h2>
  )
}
