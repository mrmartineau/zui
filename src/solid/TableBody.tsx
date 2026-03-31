import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableBodyProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
	class?: string
}

export function TableBody(props: TableBodyProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-table-body', local.class].filter(Boolean).join(' ')
	return (
		<tbody class={classes()} {...rest}>
			{local.children}
		</tbody>
	)
}
