import type { HTMLAttributes } from 'react'

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement> & {
  className?: string
}

export function TableHeader({
  className,
  children,
  ...props
}: TableHeaderProps) {
  const classes = ['zui-table-header', className].filter(Boolean).join(' ')
  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  )
}
