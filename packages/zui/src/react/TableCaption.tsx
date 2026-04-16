import type { HTMLAttributes } from 'react'

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement> & {
  className?: string
}

export function TableCaption({
  className,
  children,
  ...props
}: TableCaptionProps) {
  const classes = ['zui-table-caption', className].filter(Boolean).join(' ')
  return (
    <caption className={classes} {...props}>
      {children}
    </caption>
  )
}
