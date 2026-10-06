import { cva } from 'cva'

export const menuVariants = cva({
  base: 'zui-menu',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-menu-shape-hard',
      squircle: 'zui-menu-shape-squircle',
    },
  },
})
