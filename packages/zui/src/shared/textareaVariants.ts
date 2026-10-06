import { cva } from 'cva'

export const textareaVariants = cva({
  base: 'zui-textarea',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    shape: {
      default: '',
      hard: 'zui-textarea-shape-hard',
      soft: 'zui-textarea-shape-soft',
      squircle: 'zui-textarea-shape-squircle',
    },
  },
})
