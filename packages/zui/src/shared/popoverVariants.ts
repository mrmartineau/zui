import { cva } from 'cva'

export const popoverVariants = cva({
  base: 'zui-popover',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-popover-shape-hard',
      squircle: 'zui-popover-shape-squircle',
    },
  },
})
