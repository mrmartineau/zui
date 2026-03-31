import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & {
	class?: string
}

export function Label(props: LabelProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-label', local.class].filter(Boolean).join(' ')
	return (
		<label class={classes()} {...rest}>
			{local.children}
		</label>
	)
}
