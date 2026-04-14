import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableCellProps = JSX.TdHTMLAttributes<HTMLTableCellElement> & {
  class?: string
}

export function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-table-cell', local.class].filter(Boolean).join(' ')
  return (
    <td class={classes()} {...rest}>
      {local.children}
    </td>
  )
}
