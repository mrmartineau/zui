import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'cva'
import { buttonVariants } from '../shared/buttonVariants'

type ButtonVariantProps = VariantProps<typeof buttonVariants>

export type ButtonProps = ButtonVariantProps &
	JSX.ButtonHTMLAttributes<HTMLButtonElement> &
	JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
		class?: string
		href?: string
	}

export function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, [
		'class',
		'variant',
		'color',
		'size',
		'shape',
		'icon',
		'href',
		'children',
	])
	const classes = () =>
		buttonVariants({
			variant: local.variant,
			color: local.color,
			size: local.size,
			shape: local.shape,
			icon: local.icon,
			className: local.class,
		})

	return (
		<>
			{local.href ? (
				<a
					class={classes()}
					href={local.href}
					{...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{local.children}
				</a>
			) : (
				<button
					class={classes()}
					{...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
				>
					{local.children}
				</button>
			)}
		</>
	)
}
