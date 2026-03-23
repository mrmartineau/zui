import type { ThHTMLAttributes } from 'react'

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  className?: string
}

export function TableHead({ className, children, ...props }: TableHeadProps) {
  const classes = ['zui-table-head', className].filter(Boolean).join(' ')
  return <th className={classes} {...props}>{children}</th>
}
