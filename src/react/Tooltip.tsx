import type { VariantProps } from 'cva'
import { type HTMLAttributes, type ReactNode, useId, useRef } from 'react'
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
  const popoverRef = useRef<HTMLSpanElement>(null)

  const contentClass = [
    'zui-tooltip-content',
    tooltipVariants({ placement })
      .split(' ')
      .find((c) => c.startsWith('zui-tooltip-placement-')),
  ]
    .filter(Boolean)
    .join(' ')

  const show = () => popoverRef.current?.showPopover()
  const hide = () => popoverRef.current?.hidePopover()

  return (
    <span
      className={['zui-tooltip', className].filter(Boolean).join(' ')}
      {...props}
    >
      <span
        style={{ anchorName } as React.CSSProperties}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      <span
        popover="manual"
        ref={popoverRef}
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
