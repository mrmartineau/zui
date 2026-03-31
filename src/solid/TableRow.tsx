import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableRowProps = JSX.HTMLAttributes<HTMLTableRowElement> & {
	class?: string
}

export function TableRow(props: TableRowProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-table-row', local.class].filter(Boolean).join(' ')
	return (
		<tr class={classes()} {...rest}>
			{local.children}
		</tr>
	)
}
