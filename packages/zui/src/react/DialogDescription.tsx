import type { HTMLAttributes } from 'react'

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export function DialogDescription({
  className,
  children,
  ...props
}: DialogDescriptionProps) {
  return (
    <p
      className={['zui-dialog-description', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </p>
  )
}
