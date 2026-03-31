import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableFooterProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
	class?: string
}

export function TableFooter(props: TableFooterProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-table-footer', local.class].filter(Boolean).join(' ')
	return (
		<tfoot class={classes()} {...rest}>
			{local.children}
		</tfoot>
	)
}
