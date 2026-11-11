import type { VariantProps } from 'cva'
import type { CSSProperties, HTMLAttributes } from 'react'
import { type SkeletonSizeProps, skeletonVars } from '../shared/skeletonStyle'
import { skeletonVariants } from '../shared/skeletonVariants'

type SkeletonVariantProps = VariantProps<typeof skeletonVariants>

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    SkeletonVariantProps,
    SkeletonSizeProps {
  className?: string
}

export function Skeleton({
  className,
  shape,
  animation,
  width,
  height,
  size,
  aspectRatio,
  style,
  ...props
}: SkeletonProps) {
  const classes = skeletonVariants({ animation, className, shape })
  const vars = skeletonVars({ aspectRatio, height, size, width })
  return (
    <div
      className={classes}
      style={{ ...vars, ...style } as CSSProperties}
      aria-hidden="true"
      {...props}
    />
  )
}
