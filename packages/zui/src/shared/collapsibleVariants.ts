import { cva } from 'cva'

export const collapsibleVariants = cva({
  base: 'zui-collapsible',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-collapsible-shape-hard',
      squircle: 'zui-collapsible-shape-squircle',
    },
  },
})
