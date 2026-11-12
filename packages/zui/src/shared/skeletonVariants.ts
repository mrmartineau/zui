import { cva } from 'cva'

export const skeletonVariants = cva({
  base: 'zui-skeleton',
  defaultVariants: {
    animation: 'pulse',
    shape: 'default',
  },
  variants: {
    animation: {
      none: 'zui-skeleton-animation-none',
      pulse: '',
      wave: 'zui-skeleton-animation-wave',
    },
    shape: {
      circle: 'zui-skeleton-shape-circle',
      default: '',
      hard: 'zui-skeleton-shape-hard',
      squircle: 'zui-skeleton-shape-squircle',
    },
  },
})
