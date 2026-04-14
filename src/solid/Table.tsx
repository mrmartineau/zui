import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableProps = JSX.TableHTMLAttributes<HTMLTableElement> & {
  class?: string
}

export function Table(props: TableProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const classes = () => ['zui-table', local.class].filter(Boolean).join(' ')
  return (
    <table class={classes()} {...rest}>
      {local.children}
    </table>
  )
}
