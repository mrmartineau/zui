import type { HTMLAttributes } from 'react'

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>

export function DialogBody({ className, children, ...props }: DialogBodyProps) {
  return (
    <div
      className={['zui-dialog-body', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
