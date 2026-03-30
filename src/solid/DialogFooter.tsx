import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogFooterProps = JSX.HTMLAttributes<HTMLDivElement>

export function DialogFooter(props: DialogFooterProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () =>
		['zui-dialog-footer', local.class].filter(Boolean).join(' ')
	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	)
}
