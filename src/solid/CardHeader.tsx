import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & {
	class?: string
}

export function CardHeader(props: CardHeaderProps) {
	const [local, rest] = splitProps(props, ['class', 'children'])
	const classes = () => ['zui-card-header', local.class].filter(Boolean).join(' ')
	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	)
}
