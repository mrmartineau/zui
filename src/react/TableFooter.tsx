import type { HTMLAttributes } from 'react'

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement> & {
  className?: string
}

export function TableFooter({
  className,
  children,
  ...props
}: TableFooterProps) {
  const classes = ['zui-table-footer', className].filter(Boolean).join(' ')
  return (
    <tfoot className={classes} {...props}>
      {children}
    </tfoot>
  )
}
