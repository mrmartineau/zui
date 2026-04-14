import type { HTMLAttributes } from 'react'

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>

export function DialogHeader({
  className,
  children,
  ...props
}: DialogHeaderProps) {
  return (
    <div
      className={['zui-dialog-header', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
