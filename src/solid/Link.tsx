import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type LinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
	class?: string
}

export function Link(props: LinkProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-link', local.class].filter(Boolean).join(' ')
	return (
		<a class={classes()} {...rest}>
			{local.children}
		</a>
	)
}
