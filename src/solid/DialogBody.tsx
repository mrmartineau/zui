import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type DialogBodyProps = JSX.HTMLAttributes<HTMLDivElement>

export function DialogBody(props: DialogBodyProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () =>
		['zui-dialog-body', local.class].filter(Boolean).join(' ')
	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	)
}
