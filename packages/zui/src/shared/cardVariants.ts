import { cva } from 'cva'

export const cardVariants = cva({
  base: 'zui-card',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-card-shape-hard',
      squircle: 'zui-card-shape-squircle',
    },
  },
})
