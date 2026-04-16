import type { VariantProps } from 'cva'
import type { HTMLAttributes } from 'react'
import { flexVariants } from '../shared/flexVariants'

type FlexVariantProps = VariantProps<typeof flexVariants>

export type FlexProps = HTMLAttributes<HTMLDivElement> &
  FlexVariantProps & {
    className?: string
  }

export function Flex({
  className,
  display,
  direction,
  align,
  justify,
  wrap,
  gap,
  gapX,
  gapY,
  children,
  ...props
}: FlexProps) {
  const classes = flexVariants({
    align,
    className,
    direction,
    display,
    gap,
    gapX,
    gapY,
    justify,
    wrap,
  })
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
