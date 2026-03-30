import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableHeadProps = JSX.ThHTMLAttributes<HTMLTableCellElement> & {
	class?: string
}

export function TableHead(props: TableHeadProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-table-head', local.class].filter(Boolean).join(' ')
	return (
		<th class={classes()} {...rest}>
			{local.children}
		</th>
	)
}
