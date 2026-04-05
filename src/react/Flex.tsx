import type { HTMLAttributes } from 'react'
import type { VariantProps } from 'cva'
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
    display,
    direction,
    align,
    justify,
    wrap,
    gap,
    gapX,
    gapY,
    className,
  })
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
