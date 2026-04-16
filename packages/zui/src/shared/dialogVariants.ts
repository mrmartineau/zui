import { cva } from 'cva'

export const dialogVariants = cva({
  base: 'zui-dialog',
  defaultVariants: {
    size: 'md',
  },
  variants: {
    position: {
      bottom: 'zui-dialog-position-bottom',
      center: '',
      central: 'zui-dialog-position-central',
      left: 'zui-dialog-position-left',
      right: 'zui-dialog-position-right',
      top: 'zui-dialog-position-top',
    },
    size: {
      full: 'zui-dialog-size-full',
      lg: 'zui-dialog-size-lg',
      md: '',
      sm: 'zui-dialog-size-sm',
    },
  },
})
