import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { textSizeClass, type TextSize } from '../shared/textSizeClass'

export type TextProps = JSX.HTMLAttributes<HTMLSpanElement> & {
	size?: TextSize
	class?: string
}

export function Text(props: TextProps) {
	const [local, rest] = splitProps(props, ['size', 'class', 'children'])
	const classes = () =>
		[textSizeClass(local.size ?? '0'), local.class].filter(Boolean).join(' ')
	return (
		<span class={classes()} {...rest}>
			{local.children}
		</span>
	)
}
