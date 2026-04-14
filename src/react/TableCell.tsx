import type { TdHTMLAttributes } from 'react'

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  className?: string
}

export function TableCell({ className, children, ...props }: TableCellProps) {
  const classes = ['zui-table-cell', className].filter(Boolean).join(' ')
  return (
    <td className={classes} {...props}>
      {children}
    </td>
  )
}
