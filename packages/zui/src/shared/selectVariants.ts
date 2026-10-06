import { cva } from 'cva'

export const selectVariants = cva({
  base: 'zui-select',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-select-shape-hard',
      soft: 'zui-select-shape-soft',
      squircle: 'zui-select-shape-squircle',
    },
  },
})
