import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> & {
	class?: string
}

export function Select(props: SelectProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-select', local.class].filter(Boolean).join(' ')
	return (
		<select class={classes()} {...rest}>
			{local.children}
		</select>
	)
}
