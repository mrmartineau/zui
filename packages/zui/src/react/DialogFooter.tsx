import type { HTMLAttributes } from 'react'

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

export function DialogFooter({
  className,
  children,
  ...props
}: DialogFooterProps) {
  return (
    <div
      className={['zui-dialog-footer', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
