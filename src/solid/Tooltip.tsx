import type { JSX } from 'solid-js'
import { splitProps, createUniqueId } from 'solid-js'
import type { VariantProps } from 'cva'
import { tooltipVariants } from '../shared/tooltipVariants'

type TooltipVariantProps = VariantProps<typeof tooltipVariants>

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = JSX.HTMLAttributes<HTMLSpanElement> &
	TooltipVariantProps & {
		text: string
	}

export function Tooltip(props: TooltipProps) {
	const id = `tooltip-${createUniqueId()}`
	const anchorName = `--${id}`
	const [local, rest] = splitProps(props, [
		'text',
		'placement',
		'class',
		'children',
	])
	const contentClass = () => {
		const placementClass = tooltipVariants({ placement: local.placement })
			.split(' ')
			.find((c) => c.startsWith('zui-tooltip-placement-'))
		return ['zui-tooltip-content', placementClass].filter(Boolean).join(' ')
	}

	return (
		<span
			class={['zui-tooltip', local.class].filter(Boolean).join(' ')}
			{...rest}
		>
			<span
				style={{ 'anchor-name': anchorName }}
				popoverTarget={id}
				popoverTargetAction="hover"
			>
				{local.children}
			</span>
			<span
				popover="hint"
				id={id}
				class={contentClass()}
				role="tooltip"
				style={{ 'position-anchor': anchorName }}
			>
				{local.text}
			</span>
		</span>
	)
}
