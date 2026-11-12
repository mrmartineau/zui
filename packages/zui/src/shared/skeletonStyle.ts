type Dimension = string | number

export interface SkeletonSizeProps {
  /** Width. A number is pixels; a string is any CSS length. Default: fill the container */
  width?: Dimension
  /** Height. A number is pixels; a string is any CSS length. Default: fill the container, at least one line */
  height?: Dimension
  /** Sets width and height together */
  size?: Dimension
  /** Ratio such as `16 / 9` or `1`. Height then follows the width */
  aspectRatio?: string | number
}

const toLength = (value: Dimension) =>
  typeof value === 'number' ? `${value}px` : value

/** Turns the size props into `--zui-skeleton-*` custom properties. */
export function skeletonVars({
  width,
  height,
  size,
  aspectRatio,
}: SkeletonSizeProps): Record<string, string> {
  const vars: Record<string, string> = {}
  if (width != null) vars['--zui-skeleton-width'] = toLength(width)
  if (height != null) vars['--zui-skeleton-height'] = toLength(height)
  if (size != null) vars['--zui-skeleton-size'] = toLength(size)
  if (aspectRatio != null) {
    vars['--zui-skeleton-aspect-ratio'] = String(aspectRatio)
    // Height follows the ratio unless the caller set one
    if (height == null && size == null) vars['--zui-skeleton-height'] = 'auto'
  }
  return vars
}

/** Same as `skeletonVars`, as an inline `style` string. */
export function skeletonStyleString(props: SkeletonSizeProps): string {
  return Object.entries(skeletonVars(props))
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ')
}
