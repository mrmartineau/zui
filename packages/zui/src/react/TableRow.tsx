import type { HTMLAttributes } from 'react'

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  className?: string
}

export function TableRow({ className, children, ...props }: TableRowProps) {
  const classes = ['zui-table-row', className].filter(Boolean).join(' ')
  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  )
}
