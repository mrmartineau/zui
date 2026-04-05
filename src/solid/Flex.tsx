import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'cva'
import { flexVariants } from '../shared/flexVariants'

type FlexVariantProps = VariantProps<typeof flexVariants>

export type FlexProps = JSX.HTMLAttributes<HTMLDivElement> &
	FlexVariantProps & {
		class?: string
	}

export function Flex(props: FlexProps) {
	const [local, rest] = splitProps(props, [
		'class',
		'display',
		'direction',
		'align',
		'justify',
		'wrap',
		'gap',
		'gapX',
		'gapY',
		'children',
	])
	const classes = () =>
		flexVariants({
			display: local.display,
			direction: local.direction,
			align: local.align,
			justify: local.justify,
			wrap: local.wrap,
			gap: local.gap,
			gapX: local.gapX,
			gapY: local.gapY,
			className: local.class,
		})
	return (
		<div class={classes()} {...rest}>
			{local.children}
		</div>
	)
}
