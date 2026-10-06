import { cva } from 'cva'

export const accordionVariants = cva({
  base: 'zui-accordion',
  defaultVariants: {
    shape: 'default',
  },
  variants: {
    flush: {
      false: '',
      true: 'zui-accordion-flush',
    },
    shape: {
      default: '',
      hard: 'zui-accordion-shape-hard',
      squircle: 'zui-accordion-shape-squircle',
    },
  },
})
