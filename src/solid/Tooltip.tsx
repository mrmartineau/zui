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
	let popoverEl: HTMLElement | undefined
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

	const show = () => (popoverEl as any)?.showPopover()
	const hide = () => (popoverEl as any)?.hidePopover()

	return (
		<span
			class={['zui-tooltip', local.class].filter(Boolean).join(' ')}
			{...rest}
		>
			<span
				style={{ 'anchor-name': anchorName }}
				onMouseEnter={show}
				onMouseLeave={hide}
				onFocus={show}
				onBlur={hide}
			>
				{local.children}
			</span>
			<span
				popover="manual"
				ref={popoverEl}
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
