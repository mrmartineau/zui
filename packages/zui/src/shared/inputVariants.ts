import { cva } from 'cva'

export const inputVariants = cva({
  base: 'zui-input',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-input-shape-hard',
      soft: 'zui-input-shape-soft',
      squircle: 'zui-input-shape-squircle',
    },
  },
})
