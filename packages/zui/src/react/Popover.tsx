import type { VariantProps } from 'cva'
import type { CSSProperties, HTMLAttributes } from 'react'
import { popoverVariants } from '../shared/popoverVariants'

type PopoverVariantProps = VariantProps<typeof popoverVariants>

export type PopoverProps = HTMLAttributes<HTMLDivElement> &
  PopoverVariantProps & {
    id: string
    popover?: 'auto' | 'manual'
  }

export function Popover({
  id,
  popover = 'auto',
  className,
  shape,
  style,
  children,
  ...props
}: PopoverProps) {
  const classes = popoverVariants({ className, shape })
  const anchorStyle: CSSProperties = {
    positionAnchor: `--${id}`,
    ...style,
  }

  return (
    <div
      id={id}
      popover={popover}
      className={classes}
      style={anchorStyle}
      {...props}
    >
      {children}
    </div>
  )
}
