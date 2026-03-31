import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CheckboxProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	class?: string
}

export function Checkbox(props: CheckboxProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-checkbox', local.class].filter(Boolean).join(' ')
	return (
		<label class={classes()}>
			<input type="checkbox" {...rest} />
			{local.children}
		</label>
	)
}
