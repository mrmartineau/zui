/** @jsxImportSource solid-js */
import type { ComponentProps } from 'solid-js'
import { splitProps, createUniqueId, type JSX } from 'solid-js'
import type { VariantProps } from 'cva'
import { tooltipVariants } from '../shared/tooltipVariants'

type TooltipVariantProps = VariantProps<typeof tooltipVariants>

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = ComponentProps<'span'> & TooltipVariantProps & {
  text: string
  children: JSX.Element
}

export function Tooltip(props: TooltipProps) {
  const [local, rest] = splitProps(props, ['text', 'placement', 'class', 'children'])
  const id = `tooltip-${createUniqueId()}`
  const anchorName = `--${id}`
  const contentClass = [
    'zui-tooltip-content',
    tooltipVariants({ placement: local.placement }).split(' ').find((c) => c.startsWith('zui-tooltip-placement-')),
  ].filter(Boolean).join(' ')

  return (
    <span class={['zui-tooltip', local.class].filter(Boolean).join(' ')} {...rest}>
      <span style={{ 'anchor-name': anchorName } as JSX.CSSProperties} popoverTarget={id} popoverTargetAction="hover">
        {local.children}
      </span>
      <span
        popover="hint"
        id={id}
        class={contentClass}
        role="tooltip"
        style={{ 'position-anchor': anchorName } as JSX.CSSProperties}
      >
        {local.text}
      </span>
    </span>
  )
}
