import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type TableCaptionProps = JSX.HTMLAttributes<HTMLTableCaptionElement> & {
	class?: string
}

export function TableCaption(props: TableCaptionProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-table-caption', local.class].filter(Boolean).join(' ')
	return (
		<caption class={classes()} {...rest}>
			{local.children}
		</caption>
	)
}
