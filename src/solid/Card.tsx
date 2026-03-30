import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardProps = JSX.HTMLAttributes<HTMLDivElement> &
	JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
		class?: string
		href?: string
	}

export function Card(props: CardProps) {
	const [local, rest] = splitProps(props, ['class', 'href'])
	const classes = () =>
		['zui-card', local.href && 'zui-card-interactive', local.class]
			.filter(Boolean)
			.join(' ')

	return (
		<>
			{local.href ? (
				<a
					class={classes()}
					href={local.href}
					{...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
				/>
			) : (
				<div
					class={classes()}
					{...(rest as JSX.HTMLAttributes<HTMLDivElement>)}
				/>
			)}
		</>
	)
}
