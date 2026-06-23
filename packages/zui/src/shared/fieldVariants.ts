import { cva } from 'cva'

export const fieldVariants = cva({
  base: 'zui-field',
  defaultVariants: {
    invalid: false,
    orientation: 'vertical',
  },
  variants: {
    invalid: {
      false: '',
      true: 'zui-field-invalid',
    },
    orientation: {
      horizontal: 'zui-field-horizontal',
      responsive: 'zui-field-responsive',
      vertical: '',
    },
  },
})
