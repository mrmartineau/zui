import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableHeaderProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
  class?: string
}

export function TableHeader(props: TableHeaderProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () =>
    ['zui-table-header', local.class].filter(Boolean).join(' ')
  return (
    <thead class={classes()} {...rest}>
      {local.children}
    </thead>
  )
}
