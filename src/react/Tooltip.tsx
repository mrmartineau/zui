import { useId, type HTMLAttributes, type ReactNode } from 'react'
import type { VariantProps } from 'cva'
import { tooltipVariants } from '../shared/tooltipVariants'

type TooltipVariantProps = VariantProps<typeof tooltipVariants>

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = HTMLAttributes<HTMLSpanElement> &
  TooltipVariantProps & {
    text: string
    children: ReactNode
  }

export function Tooltip({
  text,
  placement,
  className,
  children,
  ...props
}: TooltipProps) {
  const reactId = useId()
  const id = `tooltip-${reactId.replace(/:/g, '')}`
  const anchorName = `--${id}`
  const contentClass = [
    'zui-tooltip-content',
    tooltipVariants({ placement }).split(' ').find((c) => c.startsWith('zui-tooltip-placement-')),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={['zui-tooltip', className].filter(Boolean).join(' ')} {...props}>
      <span style={{ anchorName } as React.CSSProperties} popoverTarget={id} popoverTargetAction="hover">
        {children}
      </span>
      <span
        popover="hint"
        id={id}
        className={contentClass}
        role="tooltip"
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        {text}
      </span>
    </span>
  )
}
