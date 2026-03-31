import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type ProseProps = JSX.HTMLAttributes<HTMLDivElement> & {
	class?: string
}

export function Prose(props: ProseProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['prose', local.class].filter(Boolean).join(' ')
	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	)
}
