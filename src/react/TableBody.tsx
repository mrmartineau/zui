import type { HTMLAttributes } from 'react'

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
  className?: string
}

export function TableBody({ className, children, ...props }: TableBodyProps) {
  const classes = ['zui-table-body', className].filter(Boolean).join(' ')
  return (
    <tbody className={classes} {...props}>
      {children}
    </tbody>
  )
}
