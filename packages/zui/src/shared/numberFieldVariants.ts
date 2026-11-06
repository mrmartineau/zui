import { cva } from 'cva'

export const numberFieldVariants = cva({
  base: 'zui-number-field',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-number-field-shape-hard',
      soft: 'zui-number-field-shape-soft',
    },
  },
})
