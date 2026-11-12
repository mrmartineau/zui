import type { VariantProps } from 'cva'
import type { JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import {
  type SkeletonSizeProps,
  skeletonStyleString,
  skeletonVars,
} from '../shared/skeletonStyle'
import { skeletonVariants } from '../shared/skeletonVariants'

type SkeletonVariantProps = VariantProps<typeof skeletonVariants>

export type SkeletonProps = JSX.HTMLAttributes<HTMLDivElement> &
  SkeletonVariantProps &
  SkeletonSizeProps & {
    class?: string
  }

export function Skeleton(props: SkeletonProps) {
  const [local, rest] = splitProps(props, [
    'class',
    'shape',
    'animation',
    'width',
    'height',
    'size',
    'aspectRatio',
    'style',
  ])
  const classes = () =>
    skeletonVariants({
      animation: local.animation,
      class: local.class,
      shape: local.shape,
    })
  const style = () => {
    const sizeProps = {
      aspectRatio: local.aspectRatio,
      height: local.height,
      size: local.size,
      width: local.width,
    }
    return typeof local.style === 'string'
      ? [skeletonStyleString(sizeProps), local.style].filter(Boolean).join('; ')
      : { ...skeletonVars(sizeProps), ...local.style }
  }
  return <div {...rest} class={classes()} style={style()} aria-hidden="true" />
}
