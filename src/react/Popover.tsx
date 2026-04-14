import type { CSSProperties, HTMLAttributes } from 'react'

export type PopoverProps = HTMLAttributes<HTMLDivElement> & {
  id: string
  popover?: 'auto' | 'manual'
}

export function Popover({
  id,
  popover = 'auto',
  className,
  style,
  children,
  ...props
}: PopoverProps) {
  const classes = ['zui-popover', className].filter(Boolean).join(' ')
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
