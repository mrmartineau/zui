import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type RadioProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
	class?: string
}

export function Radio(props: RadioProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-radio', local.class].filter(Boolean).join(' ')
	return (
		<label class={classes()}>
			<input type="radio" {...rest} />
			{local.children}
		</label>
	)
}
