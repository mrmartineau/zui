import type { TableHTMLAttributes } from 'react'

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  className?: string
}

export function Table({ className, children, ...props }: TableProps) {
  const classes = ['zui-table', className].filter(Boolean).join(' ')
  return (
    <table className={classes} {...props}>
      {children}
    </table>
  )
}
